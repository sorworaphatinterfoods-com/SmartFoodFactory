import React, { useState } from ‘react’;
import { MessageSquare, Bell, Users, Building2, Megaphone, Calendar, Clock, ArrowRight, Search, Menu, X } from ‘lucide-react’;

export default function InternalCommunicationPortal() {
const [activeTab, setActiveTab] = useState(‘home’);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState(’’);

const departments = [
{ id: ‘hr’, name: ‘ทรัพยากรบุคคล’, icon: Users, color: ‘from-blue-500 to-cyan-500’, abbr: ‘ทรม.’ },
{ id: ‘ac’, name: ‘บัญชี’, icon: Building2, color: ‘from-green-500 to-emerald-500’, abbr: ‘บัญชี’ },
{ id: ‘sa’, name: ‘ขาย’, icon: Megaphone, color: ‘from-orange-500 to-red-500’, abbr: ‘ขาย’ },
{ id: ‘pu’, name: ‘จัดซื้อ’, icon: MessageSquare, color: ‘from-purple-500 to-pink-500’, abbr: ‘จ.ซื้อ’ },
{ id: ‘pd’, name: ‘การผลิต’, icon: Building2, color: ‘from-yellow-500 to-orange-500’, abbr: ‘ผลิต’ },
{ id: ‘qa’, name: ‘ควบคุมคุณภาพ’, icon: Users, color: ‘from-indigo-500 to-blue-500’, abbr: ‘QA/QC’ },
{ id: ‘wh’, name: ‘คลังสินค้า’, icon: Building2, color: ‘from-slate-500 to-gray-600’, abbr: ‘คลัง’ },
{ id: ‘mn’, name: ‘บริหาร’, icon: Users, color: ‘from-rose-500 to-pink-500’, abbr: ‘บริหาร’ },
];

const announcements = [
{
id: 1,
title: ‘การประเมินผลประจำไตรมาส 1’,
department: ‘ทรม.’,
date: ‘วันนี้’,
urgent: true,
preview: ‘การประเมินผลประจำปีจะเริ่มในสัปดาห์หน้า โปรดจัดการอบรมกับหัวหน้าของคุณ…’
},
{
id: 2,
title: ‘รายงานการเงินรายเดือนเผยแพร่แล้ว’,
department: ‘บัญชี’,
date: ‘2 ชั่วโมงที่แล้ว’,
urgent: false,
preview: ‘สรุปการเงินประจำเดือนมีนาคมพร้อมให้ผู้บริหารแผนกทั้งหมด…’
},
{
id: 3,
title: ‘แคมเปญเปิดตัวสินค้าใหม่’,
department: ‘ขาย’,
date: ‘เมื่อวานนี้’,
urgent: true,
preview: ‘ข่าวดีครับ! สินค้าโฉมใหม่ของเราเปิดตัวในเดือนหน้า มีเอกสารทางการตลาดพร้อมแล้ว…’
},
];

const stats = [
{ label: ‘ข้อความทั้งหมด’, value: ‘342’, icon: MessageSquare },
{ label: ‘ประกาศ’, value: ‘28’, icon: Bell },
{ label: ‘สมาชิกในทีม’, value: ‘156’, icon: Users },
{ label: ‘กิจกรรม’, value: ‘12’, icon: Calendar },
];

return (
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
{/* Navigation Bar */}
<nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between items-center h-16">
{/* Logo */}
<div className="flex items-center gap-3">
<div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
<MessageSquare className="w-6 h-6 text-white" />
</div>
<span className="text-xl font-bold text-white hidden sm:inline">ConnectHub</span>
</div>

```
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => setActiveTab('home')} className={`transition font-medium ${activeTab === 'home' ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}>
            หน้าแรก
          </button>
          <button onClick={() => setActiveTab('departments')} className={`transition font-medium ${activeTab === 'departments' ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}>
            แผนก
          </button>
          <button onClick={() => setActiveTab('messages')} className={`transition font-medium ${activeTab === 'messages' ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}>
            ข้อความ
          </button>
          <button onClick={() => setActiveTab('events')} className={`transition font-medium ${activeTab === 'events' ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}>
            กิจกรรม
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* User Profile */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            สม
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pb-4 flex flex-col gap-3">
          <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className="text-left text-slate-300 hover:text-cyan-400 py-2 font-medium">หน้าแรก</button>
          <button onClick={() => { setActiveTab('departments'); setMobileMenuOpen(false); }} className="text-left text-slate-300 hover:text-cyan-400 py-2 font-medium">แผนก</button>
          <button onClick={() => { setActiveTab('messages'); setMobileMenuOpen(false); }} className="text-left text-slate-300 hover:text-cyan-400 py-2 font-medium">ข้อความ</button>
          <button onClick={() => { setActiveTab('events'); setMobileMenuOpen(false); }} className="text-left text-slate-300 hover:text-cyan-400 py-2 font-medium">กิจกรรม</button>
        </div>
      )}
    </div>
  </nav>

  {/* Main Content */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* HOME TAB */}
    {activeTab === 'home' && (
      <div className="space-y-12 animate-fadeIn">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ยินดีต้อนรับสู่ ConnectHub
          </h1>
          <p className="text-xl text-slate-300">ศูนย์กลางการสื่อสารขององค์กรของคุณ</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="ค้นหาแผนก ข้อความ หรือประกาศ..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition">
                    <Icon className="text-cyan-400" size={24} />
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Announcements Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Bell className="text-cyan-400" />
              ประกาศล่าสุด
            </h2>
            <a href="#" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm">
              ดูทั้งหมด <ArrowRight size={16} />
            </a>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${announcement.urgent ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                        {announcement.department}
                      </span>
                      <span className="text-sm text-slate-400 flex items-center gap-1">
                        <Clock size={14} /> {announcement.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition mb-2">{announcement.title}</h3>
                    <p className="text-slate-400 text-sm">{announcement.preview}</p>
                  </div>
                  {announcement.urgent && (
                    <div className="ml-4 flex-shrink-0 text-red-400">⚡</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* DEPARTMENTS TAB */}
    {activeTab === 'departments' && (
      <div className="animate-fadeIn">
        <h1 className="text-4xl font-bold text-white mb-2">แผนก</h1>
        <p className="text-slate-400 mb-12">เข้าถึงการสื่อสารและทรัพยากรสำหรับแต่ละแผนก</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <a
                key={dept.id}
                href={`#${dept.id}`}
                className={`group relative bg-gradient-to-br ${dept.color} rounded-2xl p-8 text-white overflow-hidden transition hover:shadow-2xl hover:scale-105 duration-300 cursor-pointer`}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition" />
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition duration-500" />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/30 transition">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
                  <p className="text-white/80 text-sm mb-6">เชื่อมต่อกับทีม {dept.abbr}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-4 transition">
                    เข้าถึง <ArrowRight size={18} />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    )}

    {/* MESSAGES TAB */}
    {activeTab === 'messages' && (
      <div className="animate-fadeIn">
        <h1 className="text-4xl font-bold text-white mb-2">ข้อความ</h1>
        <p className="text-slate-400 mb-12">ข้อความตรงและการสนทนาของทีม</p>

        <div className="max-w-3xl">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
            <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">ยังไม่มีข้อความ</h3>
            <p className="text-slate-400">เลือกการสนทนาหรือแผนกเพื่อเริ่มส่งข้อความ</p>
          </div>
        </div>
      </div>
    )}

    {/* EVENTS TAB */}
    {activeTab === 'events' && (
      <div className="animate-fadeIn">
        <h1 className="text-4xl font-bold text-white mb-2">กิจกรรม & ปฏิทิน</h1>
        <p className="text-slate-400 mb-12">กิจกรรมและวันสำคัญที่จะมาถึง</p>

        <div className="max-w-3xl">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">กิจกรรมจะเพิ่มเร็ว ๆ นี้</h3>
            <p className="text-slate-400">ติดตามเพื่อรับข้อมูลเกี่ยวกับกิจกรรมองค์กรและวันสำคัญต่างๆ</p>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Footer */}
  <footer className="border-t border-slate-700/50 mt-16 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
      <p>© 2024 ConnectHub. ระบบสื่อสารภายในองค์กร</p>
    </div>
  </footer>

  <style>{`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out;
    }
  `}</style>
</div>
```

);
}