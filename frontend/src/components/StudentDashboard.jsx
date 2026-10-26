import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  FileSpreadsheet, 
  FileText, 
  CalendarDays, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getAttendance, getMarks, getAssignments, toggleAssignmentComplete } from '../services/api';
import confetti from 'canvas-confetti';

export default function StudentDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [attRes, mRes, asgRes] = await Promise.all([
        getAttendance({ studentId: currentUser?.id }),
        getMarks({ studentId: currentUser?.id }),
        getAssignments({ studentId: currentUser?.id })
      ]);
      setAttendance(attRes.attendance || []);
      setMarks(mRes.marks || []);
      setAssignments(asgRes.assignments || []);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleToggle = async (assignmentId) => {
    try {
      const res = await toggleAssignmentComplete(assignmentId, currentUser?.id);
      if (res.isCompleted) {
        confetti({ particleCount: 40, spread: 50 });
      }
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const totalAttended = attendance.reduce((sum, a) => sum + a.attended, 0);
  const totalClasses = attendance.reduce((sum, a) => sum + a.total, 0);
  const overallAttendancePercent = totalClasses > 0 ? parseFloat(((totalAttended / totalClasses) * 100).toFixed(1)) : 88.0;

  const completedAssignmentsCount = assignments.filter(a => a.isCompleted).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Student Profile Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {currentUser?.rollNumber || 'CS2026-001'}
                </span>
                <span className="text-xs text-slate-400">
                  Semester 5 • {currentUser?.department}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">
                Welcome, {currentUser?.name}
              </h1>
              <p className="text-xs text-slate-300">
                Department of {currentUser?.department || 'Computer Science & Engineering'} • Semester V
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('assignments')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Assignments</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Current CGPA</p>
          <p className="text-2xl font-black text-white mt-1">{currentUser?.cgpa || '8.85'}</p>
          <p className="text-[11px] text-brand-400 mt-0.5">Scale of 10.0</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Overall Attendance</p>
          <p className={`text-2xl font-black mt-1 ${overallAttendancePercent < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
            {overallAttendancePercent}%
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{totalAttended} / {totalClasses} classes attended</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Completed Tasks</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {completedAssignmentsCount} / {assignments.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Course assignments</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-indigo-400">Enrolled Courses</p>
          <p className="text-2xl font-black text-indigo-400 mt-1">3</p>
          <p className="text-[11px] text-slate-500 mt-0.5">CS301, CS302, CS303</p>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div
          onClick={() => onNavigate('attendance')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition cursor-pointer group space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
            Attendance Record
          </h3>
          <p className="text-xs text-slate-400">Subject-wise lecture presence and percentage statistics.</p>
        </div>

        <div
          onClick={() => onNavigate('marks')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition cursor-pointer group space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
            Internal Marks
          </h3>
          <p className="text-xs text-slate-400">Midterm, Quiz, and Assignment grades across subjects.</p>
        </div>

        <div
          onClick={() => onNavigate('assignments')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition cursor-pointer group space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
            Course Assignments
          </h3>
          <p className="text-xs text-slate-400">Active tasks and deadlines with completion tracking.</p>
        </div>

        <div
          onClick={() => onNavigate('timetable')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition cursor-pointer group space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <CalendarDays className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
            Class Timetable
          </h3>
          <p className="text-xs text-slate-400">Class timings, room allocations, and lecture venues.</p>
        </div>

      </div>

      {/* Active Coursework */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Coursework Deliverables</span>
          </h3>
          <button
            onClick={() => onNavigate('assignments')}
            className="text-xs text-indigo-400 hover:underline font-semibold"
          >
            All Coursework →
          </button>
        </div>

        <div className="space-y-2">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition ${
                asg.isCompleted
                  ? 'bg-slate-950/40 border-emerald-500/30'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-400">{asg.courseCode}</span>
                  <span className="text-xs font-bold text-white">{asg.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Due: {new Date(asg.dueDate).toLocaleDateString()} • Max Marks: {asg.totalMarks}
                </p>
              </div>

              <button
                onClick={() => handleToggle(asg.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                  asg.isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {asg.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mark Complete</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
