import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthView from './components/AuthView';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AttendanceView from './components/AttendanceView';
import MarksView from './components/MarksView';
import AssignmentsView from './components/AssignmentsView';
import TimetableView from './components/TimetableView';
import { GraduationCap } from 'lucide-react';

function AppContent() {
  const { currentUser, role, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-2xl animate-pulse">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-white tracking-wide">UniSync Academic Portal</p>
          <p className="text-xs text-slate-400 mt-1">Initializing academic session...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show dedicated Student / Teacher Login & Sign Up page
  if (!currentUser) {
    return <AuthView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return role === 'teacher' 
          ? <TeacherDashboard onNavigate={setActiveTab} /> 
          : <StudentDashboard onNavigate={setActiveTab} />;
      case 'attendance':
        return <AttendanceView />;
      case 'marks':
        return <MarksView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'timetable':
        return <TimetableView />;
      default:
        return role === 'teacher' 
          ? <TeacherDashboard onNavigate={setActiveTab} /> 
          : <StudentDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Navbar with User Profile & Logout */}
      <Navbar />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content View */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Modern Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-5 px-4 lg:px-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">UniSync</span>
            <span>• University Academic Management System</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Office of Academic Affairs</span>
            <span>•</span>
            <span>All Rights Reserved &copy; 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
