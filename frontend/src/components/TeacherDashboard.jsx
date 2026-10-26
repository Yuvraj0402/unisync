import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  FileSpreadsheet, 
  FileText, 
  CalendarDays, 
  Users, 
  BookOpen, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getAssignments, getCourses, getStudents } from '../services/api';

export default function TeacherDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [aRes, cRes, sRes] = await Promise.all([
          getAssignments(),
          getCourses(),
          getStudents()
        ]);
        setAssignments(aRes.assignments || []);
        setCourses(cRes.courses || []);
        setStudents(sRes.students || []);
      } catch (err) {
        console.error('Failed to load teacher dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-emerald-950/40 border border-teal-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  Faculty Workspace
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentUser?.department}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white mt-1">
                Welcome, {currentUser?.name}
              </h1>
              <p className="text-xs text-slate-300">
                {currentUser?.designation} • {currentUser?.department || 'Computer Science & Engineering'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-teal-500/20 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => onNavigate('marks')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
              <span>Gradebook</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Assigned Courses</p>
          <p className="text-2xl font-black text-white mt-1">
            {currentUser?.coursesAssigned?.length || courses.length}
          </p>
          <p className="text-[11px] text-teal-400 mt-0.5 font-mono">
            {currentUser?.coursesAssigned?.join(', ') || 'CS301, CS302, CS303'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Total Enrolled</p>
          <p className="text-2xl font-black text-white mt-1">{students.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Students in section</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-slate-400">Course Assignments</p>
          <p className="text-2xl font-black text-white mt-1">{assignments.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Active deliverables</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-teal-400">Weekly Lectures</p>
          <p className="text-2xl font-black text-teal-400 mt-1">12 Hrs</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Lecture & Lab Sessions</p>
        </div>
      </div>

      {/* Quick Access Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Attendance Marker Card */}
        <div
          onClick={() => onNavigate('attendance')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-900 transition cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
              Mark Student Attendance
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your course section, date, and mark Present/Absent for each enrolled student.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-teal-400">
            <span>Open Attendance Sheet</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Gradebook Card */}
        <div
          onClick={() => onNavigate('marks')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-900 transition cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
              Internal Gradebook
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Record and edit Midterm, Quiz, and Assignment marks with automatic letter grades.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-teal-400">
            <span>Manage Gradebook</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Upload Assignments Card */}
        <div
          onClick={() => onNavigate('assignments')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/40 hover:bg-slate-900 transition cursor-pointer group space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
              Upload Assignments
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Post new homework or lab tasks and see how many students have marked them completed.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-teal-400">
            <span>Post New Task</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

      </div>

    </div>
  );
}
