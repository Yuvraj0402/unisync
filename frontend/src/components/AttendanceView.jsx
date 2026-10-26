import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Users, 
  BarChart3, 
  Sparkles,
  Save,
  Lock,
  BookOpen
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  CartesianGrid 
} from 'recharts';
import { getAttendance, getStudents, markAttendance, getCourses } from '../services/api';
import confetti from 'canvas-confetti';

export default function AttendanceView() {
  const { currentUser, role } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Teacher Marking State
  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [rosterStatus, setRosterStatus] = useState({});
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [attRes, courseRes, stuRes] = await Promise.all([
        getAttendance({ studentId: role === 'student' ? currentUser?.id : '' }),
        getCourses(),
        getStudents()
      ]);
      setAttendanceRecords(attRes.attendance || []);
      setCourses(courseRes.courses || []);
      setStudents(stuRes.students || []);

      if (courseRes.courses?.length > 0) {
        setSelectedCourse(courseRes.courses[0].code);
      }

      // Initialize teacher roster defaults
      const initialRoster = {};
      (stuRes.students || []).forEach(s => {
        initialRoster[s.id] = true;
      });
      setRosterStatus(initialRoster);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser, role]);

  const toggleStudent = (stuId) => {
    if (role !== 'teacher') return; // Strict guard
    setRosterStatus(prev => ({
      ...prev,
      [stuId]: !prev[stuId]
    }));
  };

  const markAll = (status) => {
    if (role !== 'teacher') return;
    const updated = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setRosterStatus(updated);
  };

  const handleSaveAttendance = async () => {
    if (role !== 'teacher') return;
    try {
      setSaving(true);
      await markAttendance({
        courseCode: selectedCourse,
        date: sessionDate,
        attendanceMap: rosterStatus
      });
      confetti({ particleCount: 50, spread: 60 });
      setToastMsg(`Attendance recorded for ${selectedCourse}!`);
      setTimeout(() => setToastMsg(''), 4000);
      loadData();
    } catch (err) {
      alert('Error marking attendance: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Student specific records
  const myRecords = attendanceRecords.filter(r => r.studentId === currentUser?.id);
  const chartData = myRecords.map(r => ({
    name: r.courseCode,
    percentage: r.percentage,
    attended: r.attended,
    total: r.total
  }));

  const overallAttended = myRecords.reduce((sum, r) => sum + r.attended, 0);
  const overallTotal = myRecords.reduce((sum, r) => sum + r.total, 0);
  const overallPercent = overallTotal > 0 ? parseFloat(((overallAttended / overallTotal) * 100).toFixed(1)) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border ${
        role === 'teacher'
          ? 'bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border-teal-500/20'
          : 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/20'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
              {role === 'teacher' ? (
                <span className="text-teal-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Attendance Session
                </span>
              ) : (
                <span className="text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Course Attendance Record
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {role === 'teacher' ? 'Course Attendance Management' : 'My Attendance Record'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {role === 'teacher'
                ? 'Select a course section, set lecture date, and record student attendance.'
                : 'Summary of lecture presence and class attendance across registered courses.'}
            </p>
          </div>

          {role === 'student' && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-right">
              <p className="text-xs text-slate-400">Cumulative Attendance</p>
              <p className={`text-2xl font-black mt-0.5 ${overallPercent < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                {overallPercent}%
              </p>
              <p className="text-[10px] text-slate-500">{overallAttended} of {overallTotal} classes</p>
            </div>
          )}
        </div>
      </div>

      {/* Student Academic Attendance Record */}
      {role === 'student' && (
        <div className="space-y-6">
          
          {/* Recharts Attendance Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-400" />
                <span>Attendance Percentage per Course</span>
              </h2>
              <span className="text-xs text-slate-400">Minimum 75% required for exam eligibility</span>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val) => [`${val}%`, 'Attendance']}
                  />
                  <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '75% Cutoff', fill: '#ef4444', fontSize: 10 }} />
                  <Bar dataKey="percentage" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myRecords.map((rec) => (
              <div key={rec.courseCode} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 px-2.5 py-1 rounded bg-slate-800">
                    {rec.courseCode}
                  </span>
                  <span className={`text-xs font-black ${rec.percentage < 75 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {rec.percentage}%
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Classes Attended</span>
                    <span className="font-bold text-white">{rec.attended} / {rec.total}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rec.percentage < 75 ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${rec.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TEACHER VIEW: INTERACTIVE ATTENDANCE MARKER */}
      {role === 'teacher' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Course Section:</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-semibold outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Session Date:</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => markAll(true)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => markAll(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveAttendance}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-teal-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Submit Attendance'}</span>
                </button>
              </div>
            </div>

            {/* Student Roster Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {students.map((st) => {
                const isPresent = rosterStatus[st.id] !== false;
                return (
                  <div
                    key={st.id}
                    onClick={() => toggleStudent(st.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isPresent
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100 hover:bg-emerald-950/30'
                        : 'bg-red-950/20 border-red-500/30 text-red-100 hover:bg-red-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{st.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{st.rollNumber}</p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase transition flex items-center gap-1 ${
                        isPresent
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {isPresent ? 'Present' : 'Absent'}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
