import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileSpreadsheet, 
  Award, 
  Save, 
  Sparkles, 
  Lock,
  Edit3
} from 'lucide-react';
import { getMarks, saveMarks, getStudents } from '../services/api';
import confetti from 'canvas-confetti';

export default function MarksView() {
  const { currentUser, role } = useAuth();
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Editing state for faculty
  const [editRow, setEditRow] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mRes, sRes] = await Promise.all([
        getMarks({ studentId: role === 'student' ? currentUser?.id : '' }),
        getStudents()
      ]);
      setMarks(mRes.marks || []);
      setStudents(sRes.students || []);
    } catch (err) {
      console.error('Failed to load marks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser, role]);

  const handleStartEdit = (record) => {
    if (role !== 'teacher') return; // Strict guard
    setEditRow({ ...record });
  };

  const handleSaveMarks = async () => {
    if (role !== 'teacher' || !editRow) return;
    try {
      setSaving(true);
      await saveMarks({
        studentId: editRow.studentId,
        courseCode: editRow.courseCode,
        midterm: editRow.midterm,
        quiz: editRow.quiz,
        assignment: editRow.assignment
      });
      confetti({ particleCount: 40, spread: 50 });
      setToastMsg(`Marks updated for ${editRow.courseCode}!`);
      setTimeout(() => setToastMsg(''), 3000);
      setEditRow(null);
      loadData();
    } catch (err) {
      alert('Error updating marks: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const gradeColors = {
    'O': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'A+': 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    'A': 'text-brand-400 bg-brand-500/10 border-brand-500/30',
    'B+': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    'B': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'C': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    'F': 'text-red-400 bg-red-500/10 border-red-500/30'
  };

  const myMarks = marks.filter(m => m.studentId === currentUser?.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>{toastMsg}</span>
        </div>
      )}

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
                  <Award className="w-4 h-4" /> Internal Gradebook
                </span>
              ) : (
                <span className="text-indigo-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Internal Assessment Records
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {role === 'teacher' ? 'Course Gradebook' : 'Internal Assessment Scores'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {role === 'teacher'
                ? 'Evaluation of Midterm (50m), Quiz (20m), and Assignment (50m) scores with automatic grade calculation.'
                : 'Summary of internal evaluations and cumulative letter grades across registered subjects.'}
            </p>
          </div>
        </div>
      </div>

      {/* Student View */}
      {role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myMarks.map((m) => (
            <div key={m.courseCode} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 px-2.5 py-1 rounded bg-slate-800">
                  {m.courseCode}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase border ${gradeColors[m.grade] || 'text-white'}`}>
                  Grade: {m.grade} ({m.totalPercentage}%)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <p className="text-[10px] uppercase text-slate-400">Midterm</p>
                  <p className="text-sm font-bold text-white">{m.midterm} / 50</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <p className="text-[10px] uppercase text-slate-400">Quiz</p>
                  <p className="text-sm font-bold text-white">{m.quiz} / 20</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <p className="text-[10px] uppercase text-slate-400">Assignment</p>
                  <p className="text-sm font-bold text-white">{m.assignment} / 50</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Teacher View */}
      {role === 'teacher' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
              <span>Student Academic Marks</span>
            </h2>
            <span className="text-xs text-slate-400">Semester V Assessment</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">Midterm (50)</th>
                  <th className="py-2.5 px-3">Quiz (20)</th>
                  <th className="py-2.5 px-3">Assignment (50)</th>
                  <th className="py-2.5 px-3">Total %</th>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {marks.map((m, idx) => {
                  const student = students.find(s => s.id === m.studentId);
                  const isEditing = editRow && editRow.studentId === m.studentId && editRow.courseCode === m.courseCode;

                  return (
                    <tr key={idx} className="hover:bg-slate-850/50 transition">
                      <td className="py-3 px-3 font-medium text-white flex items-center gap-2">
                        <img
                          src={student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80'}
                          alt={student?.name}
                          className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <p>{student?.name || m.studentId}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{student?.rollNumber}</p>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-slate-300">
                        {m.courseCode}
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            max="50"
                            min="0"
                            value={editRow.midterm}
                            onChange={(e) => setEditRow({ ...editRow, midterm: Number(e.target.value) })}
                            className="w-16 px-2 py-1 rounded bg-slate-950 border border-teal-500 text-white font-bold"
                          />
                        ) : (
                          <span className="text-slate-200">{m.midterm}</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            max="20"
                            min="0"
                            value={editRow.quiz}
                            onChange={(e) => setEditRow({ ...editRow, quiz: Number(e.target.value) })}
                            className="w-16 px-2 py-1 rounded bg-slate-950 border border-teal-500 text-white font-bold"
                          />
                        ) : (
                          <span className="text-slate-200">{m.quiz}</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            max="50"
                            min="0"
                            value={editRow.assignment}
                            onChange={(e) => setEditRow({ ...editRow, assignment: Number(e.target.value) })}
                            className="w-16 px-2 py-1 rounded bg-slate-950 border border-teal-500 text-white font-bold"
                          />
                        ) : (
                          <span className="text-slate-200">{m.assignment}</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-bold text-white">
                        {m.totalPercentage}%
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${gradeColors[m.grade]}`}>
                          {m.grade}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              disabled={saving}
                              onClick={handleSaveMarks}
                              className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditRow(null)}
                              className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(m)}
                            className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-semibold ml-auto"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Marks</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
