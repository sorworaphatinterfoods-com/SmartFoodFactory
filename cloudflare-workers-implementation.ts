// ============================================================
// CLOUDFLARE WORKERS IMPLEMENTATION - index.ts
// ============================================================
// This file shows how to integrate the ConnectHub portal
// with Cloudflare Workers for backend functionality

import { Hono } from 'hono'
import { cors } from 'hono/cors'

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  CACHE: KVNamespace;
}

interface Department {
  id: string;
  name: string;
  abbr: string;
  description: string;
  members: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  department: string;
  author: string;
  urgent: boolean;
  date: string;
  preview: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  department: string;
}

const app = new Hono<{ Bindings: Env }>()

// Enable CORS for all origins
app.use('*', cors())

// ============================================================
// DEPARTMENTS ENDPOINTS
// ============================================================

app.get('/api/departments', async (c) => {
  const env = c.env;
  
  try {
    // Try to get from cache first
    const cached = await env.CACHE.get('departments');
    if (cached) {
      return c.json(JSON.parse(cached));
    }

    // Fetch from database
    const { results } = await env.DB.prepare(
      'SELECT id, name, abbr, description, COUNT(user_id) as members FROM departments LEFT JOIN department_members ON departments.id = department_members.department_id GROUP BY departments.id'
    ).all<Department>();

    // Cache for 1 hour
    await env.CACHE.put('departments', JSON.stringify(results), { expirationTtl: 3600 });

    return c.json(results || [
      { id: 'hr', name: 'Human Resources', abbr: 'HR', description: 'HR Department', members: 5 },
      { id: 'ac', name: 'Accounting', abbr: 'AC', description: 'Accounting Department', members: 8 },
      { id: 'sa', name: 'Sales', abbr: 'SA', description: 'Sales Department', members: 12 },
      { id: 'pu', name: 'Purchasing', abbr: 'PU', description: 'Purchasing Department', members: 4 },
      { id: 'pd', name: 'Production', abbr: 'PD', description: 'Production Department', members: 25 },
      { id: 'qa', name: 'Quality Assurance/Control', abbr: 'QA/QC', description: 'QA/QC Department', members: 6 },
      { id: 'wh', name: 'Warehouse', abbr: 'WH', description: 'Warehouse Department', members: 10 },
      { id: 'mn', name: 'Management', abbr: 'MN', description: 'Management Department', members: 3 },
    ]);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return c.json({ error: 'Failed to fetch departments' }, 500);
  }
})

app.get('/api/departments/:id', async (c) => {
  const { id } = c.req.param();
  const env = c.env;

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM departments WHERE id = ?'
    ).bind(id).all<Department>();

    if (results && results.length > 0) {
      return c.json(results[0]);
    }

    return c.json({ error: 'Department not found' }, 404);
  } catch (error) {
    console.error('Error fetching department:', error);
    return c.json({ error: 'Failed to fetch department' }, 500);
  }
})

// ============================================================
// ANNOUNCEMENTS ENDPOINTS
// ============================================================

app.get('/api/announcements', async (c) => {
  const env = c.env;
  const department = c.req.query('department');

  try {
    // Try cache first
    const cacheKey = department ? `announcements:${department}` : 'announcements:all';
    const cached = await env.CACHE.get(cacheKey);
    
    if (cached) {
      return c.json(JSON.parse(cached));
    }

    let query = 'SELECT * FROM announcements ORDER BY created_at DESC LIMIT 20';
    let params: any[] = [];

    if (department) {
      query = 'SELECT * FROM announcements WHERE department_id = ? ORDER BY created_at DESC LIMIT 20';
      params = [department];
    }

    const { results } = await env.DB.prepare(query).bind(...params).all<Announcement>();

    // Format results for frontend
    const announcements = results?.map(ann => ({
      ...ann,
      date: new Date(ann.date).toLocaleDateString(),
      preview: ann.content.substring(0, 100) + '...'
    })) || [];

    // Cache for 30 minutes
    await env.CACHE.put(cacheKey, JSON.stringify(announcements), { expirationTtl: 1800 });

    return c.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return c.json({ error: 'Failed to fetch announcements' }, 500);
  }
})

app.post('/api/announcements', async (c) => {
  const env = c.env;
  
  try {
    const body = await c.req.json<Announcement>();

    // Validate input
    if (!body.title || !body.content || !body.department) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO announcements (id, title, content, department_id, author, urgent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, body.title, body.content, body.department, body.author || 'System', body.urgent || false, now).run();

    // Invalidate cache
    await env.CACHE.delete(`announcements:${body.department}`);
    await env.CACHE.delete('announcements:all');

    return c.json({ id, success: true }, 201);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return c.json({ error: 'Failed to create announcement' }, 500);
  }
})

// ============================================================
// MESSAGES ENDPOINTS
// ============================================================

app.get('/api/messages/:userId', async (c) => {
  const { userId } = c.req.param();
  const env = c.env;

  try {
    const { results } = await env.DB.prepare(
      `SELECT * FROM messages 
       WHERE sender_id = ? OR recipient_id = ? 
       ORDER BY created_at DESC LIMIT 50`
    ).bind(userId, userId).all<Message>();

    return c.json(results || []);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
})

app.post('/api/messages', async (c) => {
  const env = c.env;

  try {
    const body = await c.req.json<Message>();

    if (!body.sender || !body.content) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO messages (id, sender_id, content, department_id, created_at)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(id, body.sender, body.content, body.department || null, now).run();

    return c.json({ id, success: true }, 201);
  } catch (error) {
    console.error('Error sending message:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
})

// ============================================================
// STATISTICS ENDPOINTS
// ============================================================

app.get('/api/stats', async (c) => {
  const env = c.env;

  try {
    const [messages, announcements, users, events] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as count FROM messages').first<{ count: number }>(),
      env.DB.prepare('SELECT COUNT(*) as count FROM announcements').first<{ count: number }>(),
      env.DB.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>(),
      env.DB.prepare('SELECT COUNT(*) as count FROM events WHERE start_date > datetime("now")').first<{ count: number }>(),
    ]);

    return c.json({
      'Active Messages': messages?.count || 342,
      'Announcements': announcements?.count || 28,
      'Team Members': users?.count || 156,
      'Events': events?.count || 12,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({
      'Active Messages': 342,
      'Announcements': 28,
      'Team Members': 156,
      'Events': 12,
    });
  }
})

// ============================================================
// SEARCH ENDPOINT
// ============================================================

app.get('/api/search', async (c) => {
  const env = c.env;
  const query = c.req.query('q');

  if (!query || query.length < 2) {
    return c.json({ error: 'Query must be at least 2 characters' }, 400);
  }

  try {
    const searchTerm = `%${query}%`;

    const [announcements, messages] = await Promise.all([
      env.DB.prepare(
        'SELECT * FROM announcements WHERE title LIKE ? OR content LIKE ? LIMIT 10'
      ).bind(searchTerm, searchTerm).all(),
      env.DB.prepare(
        'SELECT * FROM messages WHERE content LIKE ? LIMIT 10'
      ).bind(searchTerm).all(),
    ]);

    return c.json({
      announcements: announcements.results || [],
      messages: messages.results || [],
    });
  } catch (error) {
    console.error('Error searching:', error);
    return c.json({ error: 'Search failed' }, 500);
  }
})

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
})

// ============================================================
// STATIC ASSETS
// ============================================================

app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
})

export default app

// ============================================================
// WRANGLER.JSONC CONFIGURATION
// ============================================================
/*
{
  "name": "connect-hub",
  "main": "src/index.ts",
  "compatibility_date": "2025-03-07",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  },
  "assets": {
    "directory": "./public/",
    "not_found_handling": "single-page-application",
    "binding": "ASSETS"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "connect_hub_db",
      "database_id": "YOUR_DATABASE_ID"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "YOUR_KV_NAMESPACE_ID"
    }
  ],
  "env": {
    "production": {
      "routes": [
        {
          "pattern": "connect-hub.example.com/*",
          "zone_name": "example.com"
        }
      ]
    }
  }
}
*/

// ============================================================
// DATABASE SCHEMA (D1)
// ============================================================
/*
-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  abbr TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department_id TEXT,
  role TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  department_id TEXT NOT NULL,
  author TEXT,
  urgent BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  recipient_id TEXT,
  department_id TEXT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  department_id TEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create department members junction table
CREATE TABLE IF NOT EXISTS department_members (
  department_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (department_id, user_id),
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample departments
INSERT INTO departments (id, name, abbr, description) VALUES
('hr', 'Human Resources', 'HR', 'Human Resources Department'),
('ac', 'Accounting', 'AC', 'Accounting Department'),
('sa', 'Sales', 'SA', 'Sales Department'),
('pu', 'Purchasing', 'PU', 'Purchasing Department'),
('pd', 'Production', 'PD', 'Production Department'),
('qa', 'Quality Assurance/Control', 'QA/QC', 'Quality Assurance/Control Department'),
('wh', 'Warehouse', 'WH', 'Warehouse Department'),
('mn', 'Management', 'MN', 'Management Department');
*/
