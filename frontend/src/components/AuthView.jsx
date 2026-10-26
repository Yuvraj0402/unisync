import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  UserCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Hash, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthView({ initialPortal = 'student' }) {
  const { login, register } = useAuth();
  const [activePortal, setActivePortal] = useState(initialPortal); // 'student' or 'teacher'
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science & Engineering',
    rollNumber: '',
    designation: 'Assistant Professor'
  });

  const handlePortalSwitch = (portal) => {
    setActivePortal(portal);
    setErrorMsg('');
    setIsSignUp(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        await register({
          ...formData,
          role: activePortal
        });
        confetti({ particleCount: 50, spread: 60 });
      } else {
        await login(formData.email, formData.password, activePortal);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-brand-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
        activePortal === 'teacher' ? 'bg-teal-500/10' : 'bg-indigo-500/10'
      }`}></div>

      <div className="w-full max-w-md z-10 space-y-6">
        
        {/* University Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-xl shadow-brand-500/20 mb-1 ring-1 ring-white/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            UniSync University Portal
          </h1>
          <p className="text-xs text-slate-400">
            Official Academic Attendance, Gradebook & Coursework System
          </p>
        </div>

        {/* Portal Switcher Tabs (Different for Student & Teacher) */}
        <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => handlePortalSwitch('student')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activePortal === 'student'
                ? 'bg-gradient-to-r from-indigo-600 to-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handlePortalSwitch('teacher')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activePortal === 'teacher'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Teacher Portal</span>
          </button>
        </div>

        {/* Auth Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">
                {activePortal === 'teacher' ? 'Faculty & Instructor' : 'Student'} {isSignUp ? 'Registration' : 'Sign In'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isSignUp
                  ? `Create your official ${activePortal} account`
                  : `Enter your credentials to access the ${activePortal} dashboard`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
              className="text-xs font-bold text-brand-400 hover:text-brand-300 underline"
            >
              {isSignUp ? 'Existing user? Log In' : 'New user? Sign Up'}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Full Name:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={activePortal === 'teacher' ? 'Dr. Priya Sharma' : 'Aarav Patel'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            {isSignUp && activePortal === 'student' && (
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Roll Number:</label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="CS2026-001"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            {isSignUp && activePortal === 'teacher' && (
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Academic Designation:</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Assistant Professor / Associate Professor"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Department:</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-brand-500"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">University Email Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder={activePortal === 'teacher' ? 'teacher.elena@unisync.edu' : 'student.aarav@unisync.edu'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Account Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 ${
                activePortal === 'teacher'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-500/20'
                  : 'bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 shadow-indigo-500/20'
              }`}
            >
              <span>{loading ? 'Authenticating...' : isSignUp ? `Create ${activePortal} Account` : `Sign In as ${activePortal === 'teacher' ? 'Faculty' : 'Student'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
