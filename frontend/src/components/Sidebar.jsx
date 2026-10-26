import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  CalendarDays,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { role, currentUser } = useAuth();

  const teacherNav = [
    { id: 'overview', label: 'Faculty Overview', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance Management', icon: CheckCircle2 },
    { id: 'marks', label: 'Internal Gradebook', icon: FileSpreadsheet },
    { id: 'assignments', label: 'Course Assignments', icon: FileText },
    { id: 'timetable', label: 'Teaching Schedule', icon: CalendarDays }
  ];

  const studentNav = [
    { id: 'overview', label: 'Academic Overview', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance Record', icon: CheckCircle2 },
    { id: 'marks', label: 'Internal Assessment', icon: FileSpreadsheet },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'timetable', label: 'Class Timetable', icon: CalendarDays }
  ];

  const navItems = role === 'teacher' ? teacherNav : studentNav;

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-slate-950/60 border-r border-slate-800/80 min-h-[calc(100vh-65px)] p-4">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition group ${
                    isActive
                      ? role === 'teacher'
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                        : 'bg-gradient-to-r from-indigo-600 to-brand-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Institutional Department Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-brand-400 font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Academic Division</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium">
            {currentUser?.department || 'Computer Science & Engineering'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Semester V • Division A
          </p>
        </div>
      </div>
    </aside>
  );
}
