import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Users, 
  Sparkles,
  BookOpen,
  Calendar
} from 'lucide-react';
import { getAssignments, uploadAssignment, toggleAssignmentComplete, getCourses } from '../services/api';
import confetti from 'canvas-confetti';

export default function AssignmentsView() {
  const { currentUser, role } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Upload Form State for Teacher
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('CS301');
  const [dueDate, setDueDate] = useState('2026-11-06T23:59');
  const [totalMarks, setTotalMarks] = useState(50);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aRes, cRes] = await Promise.all([
        getAssignments({ studentId: role === 'student' ? currentUser?.id : '' }),
        getCourses()
      ]);
      setAssignments(aRes.assignments || []);
      setCourses(cRes.courses || []);
      if (cRes.courses?.length > 0) {
        setCourseCode(cRes.courses[0].code);
      }
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser, role]);

  // STUDENT: Toggle completion status
  const handleToggleComplete = async (assignmentId) => {
    if (role !== 'student') return;
    try {
      const res = await toggleAssignmentComplete(assignmentId, currentUser?.id);
      if (res.isCompleted) {
        confetti({ particleCount: 50, spread: 60 });
        setToastMsg('Assignment marked as completed!');
      } else {
        setToastMsg('Assignment marked as pending.');
      }
      setTimeout(() => setToastMsg(''), 3000);
      loadData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // TEACHER: Upload assignment
  const handleUpload = async (e) => {
    e.preventDefault();
    if (role !== 'teacher') return;
    try {
      setSubmitting(true);
      await uploadAssignment({
        title,
        courseCode,
        dueDate,
        totalMarks: Number(totalMarks),
        description
      });
      confetti({ particleCount: 50, spread: 60 });
      setToastMsg('New course assignment uploaded!');
      setTimeout(() => setToastMsg(''), 4000);
      setShowModal(false);
      setTitle('');
      setDescription('');
      loadData();
    } catch (err) {
      alert('Error uploading assignment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-500 text-slate-950 px-4 py-3 rounded-xl font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
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
                  <FileText className="w-4 h-4" /> Course Deliverables
                </span>
              ) : (
                <span className="text-indigo-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Active Assignments
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {role === 'teacher' ? 'Course Assignments' : 'Assignments & Coursework'}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {role === 'teacher'
                ? 'Manage assignment deliverables, deadlines, and submissions for enrolled students.'
                : 'Review upcoming coursework deliverables and track your completion status.'}
            </p>
          </div>

          {role === 'teacher' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-teal-500/20 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Assignment</span>
            </button>
          )}
        </div>
      </div>

      {/* Assignment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((item) => {
          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                item.isCompleted
                  ? 'bg-slate-900/40 border-emerald-500/30'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {item.courseCode}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    Max Marks: {item.totalMarks}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Due: {new Date(item.dueDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* STUDENT: Toggle Complete Button */}
                {role === 'student' && (
                  <button
                    onClick={() => handleToggleComplete(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition text-xs shrink-0 ${
                      item.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.isCompleted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-slate-400" />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>
                )}

                {/* TEACHER: View student completions count */}
                {role === 'teacher' && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span>Completed by <strong className="text-white">{item.completedCount} students</strong></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* TEACHER UPLOAD MODAL */}
      {showModal && role === 'teacher' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Upload New Assignment</h3>
                <p className="text-xs text-slate-400">Post a new task for your enrolled course students</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Assignment Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. CPU Scheduling Simulation & Banker's Algorithm"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Course:</label>
                  <select
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Max Total Marks:</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Submission Due Date & Time:</label>
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Instructions & Description:</label>
                <textarea
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify submission format, programming language, and deliverables..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold shadow-lg"
                >
                  {submitting ? 'Uploading...' : 'Publish to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
