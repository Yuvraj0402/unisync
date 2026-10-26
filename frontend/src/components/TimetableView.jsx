import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { getTimetable } from '../services/api';

export default function TimetableView() {
  const { currentUser, role } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const days = ['ALL', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await getTimetable({
          role,
          teacherId: role === 'teacher' ? currentUser?.id : ''
        });
        setTimetable(res.timetable || []);
      } catch (err) {
        console.error('Failed to load timetable:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser, role]);

  const filteredSlots = timetable.filter(t => {
    if (selectedDay === 'ALL') return true;
    return t.day === selectedDay;
  });

  const typeStyles = {
    'Lecture': 'bg-brand-500/10 text-brand-300 border-brand-500/30',
    'Lab': 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    'Tutorial': 'bg-purple-500/10 text-purple-300 border-purple-500/30'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Banner */}
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
                  <CalendarDays className="w-4 h-4" /> Academic Timetable
                </span>
              ) : (
                <span className="text-indigo-400 flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" /> Semester Class Schedule
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {role === 'teacher' ? 'Weekly Teaching Schedule' : 'Weekly Class Timetable'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {role === 'teacher'
                ? `Faculty lecture and laboratory schedule for ${currentUser?.name}.`
                : `Course timetable for ${currentUser?.name} across all registered semester subjects.`}
            </p>
          </div>

          {/* Day Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedDay === d
                    ? role === 'teacher'
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow'
                      : 'bg-gradient-to-r from-indigo-600 to-brand-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      {filteredSlots.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
          <CalendarDays className="w-8 h-8 text-brand-400 mx-auto mb-2" />
          <p className="font-semibold text-white">No Classes Scheduled for {selectedDay}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 font-mono">
                    {slot.day}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${typeStyles[slot.type] || 'text-slate-300'}`}>
                    {slot.type}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">
                  {slot.courseName}
                </h3>
                <p className="text-xs text-brand-400 font-mono font-semibold">
                  {slot.courseCode}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{slot.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{slot.room}</span>
                </div>
                {role === 'teacher' ? (
                  <div className="flex items-center gap-2 text-teal-300">
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    <span>Target Cohort: {slot.classBatch}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Instructor: {slot.faculty}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
