import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  LogOut, 
  Calendar,
  Building
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-brand-500/20 ring-1 ring-white/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                UniSync
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                role === 'teacher'
                  ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
              }`}>
                {role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              University Academic Management System
            </p>
          </div>
        </div>

        {/* Center: University Session Info */}
        <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Calendar className="w-3.5 h-3.5 text-brand-400" />
            <span>Academic Year 2026–2027</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 font-medium">Semester V (Fall Term)</span>
        </div>

        {/* Right: User Profile & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900 border border-slate-800">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white line-clamp-1">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-400">
                {role === 'teacher' ? currentUser?.designation : `Roll No: ${currentUser?.rollNumber || 'CS2024'}`}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-300 text-xs font-semibold transition"
            title="Sign out of UniSync"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
}
