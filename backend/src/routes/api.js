import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { inMemoryStore } from '../config/firebase.js';

const router = express.Router();

// Helper to get active user from headers
function getReqUser(req) {
  const userId = req.headers['x-user-id'];
  if (userId) {
    return inMemoryStore.users.find(u => u.id === userId) || null;
  }
  return null;
}

// -------------------------------------------------------------
// AUTHENTICATION (SEPARATE STUDENT & TEACHER SIGNUP / LOGIN)
// -------------------------------------------------------------

// Institutional accounts directory
router.get('/auth/users', (req, res) => {
  res.json({
    teachers: inMemoryStore.faculty.map(f => ({
      id: f.id,
      name: f.name,
      email: f.email,
      role: 'teacher',
      designation: f.designation,
      department: f.department,
      avatar: f.avatar
    })),
    students: inMemoryStore.students.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      role: 'student',
      rollNumber: s.rollNumber,
      department: s.department,
      avatar: s.avatar
    }))
  });
});

// Student & Teacher Login
router.post('/auth/login', (req, res) => {
  const { email, password, expectedRole } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = inMemoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Verify role restriction
  if (expectedRole && user.role !== expectedRole) {
    return res.status(403).json({
      error: `Access Denied: This account is registered as a ${user.role}. Please log in via the ${user.role === 'teacher' ? 'Teacher' : 'Student'} Portal.`
    });
  }

  // Password check (sample default is 'password123')
  if (user.password && user.password !== password) {
    return res.status(401).json({ error: 'Invalid password. Please try again.' });
  }

  res.json({
    success: true,
    message: `Logged in successfully as ${user.name} (${user.role})`,
    user
  });
});

// Student & Teacher Registration
router.post('/auth/register', (req, res) => {
  const { name, email, password, role, department, rollNumber, designation } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  if (role !== 'student' && role !== 'teacher') {
    return res.status(400).json({ error: 'Role must be either student or teacher.' });
  }

  const existing = inMemoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const newId = role === 'teacher' ? `fac-${Date.now()}` : `stu-${Date.now()}`;
  const defaultAvatar = role === 'teacher'
    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  let newUser = {
    id: newId,
    name,
    email,
    password,
    role,
    department: department || 'Computer Science & Engineering',
    avatar: defaultAvatar
  };

  if (role === 'teacher') {
    newUser.designation = designation || 'Assistant Professor';
    newUser.coursesAssigned = ['CS301'];
    inMemoryStore.faculty.push(newUser);
    // Initialize empty teacher timetable
    inMemoryStore.teacherTimetables[newId] = [
      { id: `tt-${newId}-1`, day: 'Monday', time: '10:00 - 11:30', courseCode: 'CS301', courseName: 'Database Management', room: 'Hall 201', classBatch: 'CS 5th Sem', type: 'Lecture' }
    ];
  } else {
    newUser.rollNumber = rollNumber || `CS2026-${Math.floor(100 + Math.random() * 900)}`;
    newUser.semester = 5;
    newUser.cgpa = 8.0;
    newUser.enrolledCourses = ['CS301', 'CS302', 'CS303'];
    inMemoryStore.students.push(newUser);

    // Initialize default attendance records
    ['CS301', 'CS302', 'CS303'].forEach(c => {
      inMemoryStore.attendance.push({
        studentId: newId,
        courseCode: c,
        attended: 24,
        total: 28,
        percentage: 85.7
      });
      inMemoryStore.marks.push({
        studentId: newId,
        courseCode: c,
        midterm: 40,
        quiz: 16,
        assignment: 42,
        totalPercentage: 81.6,
        grade: 'A'
      });
    });
  }

  inMemoryStore.users.push(newUser);

  res.status(201).json({
    success: true,
    message: `Account created successfully for ${name}.`,
    user: newUser
  });
});

// -------------------------------------------------------------
// ATTENDANCE (TEACHER MARKS, STUDENT VIEWS ONLY)
// -------------------------------------------------------------
router.get('/attendance', (req, res) => {
  const { studentId, courseCode } = req.query;
  let records = inMemoryStore.attendance;

  if (studentId) {
    records = records.filter(r => r.studentId === studentId);
  }
  if (courseCode) {
    records = records.filter(r => r.courseCode === courseCode);
  }

  res.json({ attendance: records });
});

// ONLY TEACHER CAN MARK ATTENDANCE
router.post('/attendance/mark', (req, res) => {
  const user = getReqUser(req);
  if (user && user.role !== 'teacher') {
    return res.status(403).json({ error: 'Access Denied: Only teachers are authorized to mark attendance.' });
  }

  const { courseCode, date, attendanceMap } = req.body;

  if (!courseCode || !attendanceMap) {
    return res.status(400).json({ error: 'Course code and student attendance map are required.' });
  }

  Object.entries(attendanceMap).forEach(([studentId, isPresent]) => {
    let record = inMemoryStore.attendance.find(r => r.studentId === studentId && r.courseCode === courseCode);
    if (!record) {
      record = {
        studentId,
        courseCode,
        attended: 0,
        total: 0,
        percentage: 0
      };
      inMemoryStore.attendance.push(record);
    }
    record.total += 1;
    if (isPresent) record.attended += 1;
    record.percentage = parseFloat(((record.attended / record.total) * 100).toFixed(1));
  });

  res.json({
    success: true,
    message: `Attendance marked for ${courseCode} on ${date || 'today'}.`
  });
});

// -------------------------------------------------------------
// INTERNAL GRADEBOOK (TEACHER EDITS, STUDENT VIEWS ONLY)
// -------------------------------------------------------------
router.get('/marks', (req, res) => {
  const { studentId, courseCode } = req.query;
  let records = inMemoryStore.marks;

  if (studentId) {
    records = records.filter(m => m.studentId === studentId);
  }
  if (courseCode) {
    records = records.filter(m => m.courseCode === courseCode);
  }

  res.json({ marks: records });
});

// ONLY TEACHER CAN EDIT / SAVE MARKS
router.post('/marks/save', (req, res) => {
  const user = getReqUser(req);
  if (user && user.role !== 'teacher') {
    return res.status(403).json({ error: 'Access Denied: Only teachers are authorized to edit internal marks.' });
  }

  const { studentId, courseCode, midterm, quiz, assignment } = req.body;

  if (!studentId || !courseCode) {
    return res.status(400).json({ error: 'studentId and courseCode are required.' });
  }

  const mMidterm = Number(midterm) || 0;
  const mQuiz = Number(quiz) || 0;
  const mAssignment = Number(assignment) || 0;
  const total = mMidterm + mQuiz + mAssignment;
  const maxTotal = 50 + 20 + 50; // 120
  const pct = parseFloat(((total / maxTotal) * 100).toFixed(1));

  let grade = 'F';
  if (pct >= 90) grade = 'O';
  else if (pct >= 80) grade = 'A+';
  else if (pct >= 70) grade = 'A';
  else if (pct >= 60) grade = 'B+';
  else if (pct >= 50) grade = 'B';
  else if (pct >= 40) grade = 'C';

  let record = inMemoryStore.marks.find(m => m.studentId === studentId && m.courseCode === courseCode);
  if (!record) {
    record = {
      studentId,
      courseCode,
      midterm: mMidterm,
      quiz: mQuiz,
      assignment: mAssignment,
      totalPercentage: pct,
      grade
    };
    inMemoryStore.marks.push(record);
  } else {
    record.midterm = mMidterm;
    record.quiz = mQuiz;
    record.assignment = mAssignment;
    record.totalPercentage = pct;
    record.grade = grade;
  }

  res.json({
    success: true,
    message: 'Gradebook updated successfully.',
    record
  });
});

// -------------------------------------------------------------
// ASSIGNMENTS (TEACHER UPLOADS, STUDENT MARKS COMPLETE / NOT)
// -------------------------------------------------------------
router.get('/assignments', (req, res) => {
  const { studentId } = req.query;
  const user = getReqUser(req);
  const activeStudentId = studentId || (user?.role === 'student' ? user.id : null);

  const list = inMemoryStore.assignments.map(asg => {
    // Check if this student marked complete
    const isCompleted = activeStudentId ? Boolean(inMemoryStore.completions[`${activeStudentId}_${asg.id}`]) : false;
    
    // Count total students who marked it complete
    const completedStudents = inMemoryStore.students.filter(
      s => inMemoryStore.completions[`${s.id}_${asg.id}`]
    ).map(s => ({ id: s.id, name: s.name, rollNumber: s.rollNumber }));

    return {
      ...asg,
      isCompleted,
      completedCount: completedStudents.length,
      completedStudents
    };
  });

  res.json({ assignments: list });
});

// TEACHER UPLOADS ASSIGNMENT
router.post('/assignments', (req, res) => {
  const user = getReqUser(req);
  if (user && user.role !== 'teacher') {
    return res.status(403).json({ error: 'Access Denied: Only teachers can create assignments.' });
  }

  const { title, courseCode, dueDate, totalMarks, description } = req.body;
  if (!title || !courseCode || !dueDate) {
    return res.status(400).json({ error: 'Title, courseCode, and dueDate are required.' });
  }

  const course = inMemoryStore.courses.find(c => c.code === courseCode);

  const newAssignment = {
    id: `asg-${Date.now()}`,
    title,
    courseCode,
    courseName: course?.name || courseCode,
    facultyId: user?.id || 'fac-1',
    facultyName: user?.name || 'Course Faculty',
    dueDate,
    totalMarks: Number(totalMarks) || 50,
    description: description || ''
  };

  inMemoryStore.assignments.unshift(newAssignment);

  res.status(201).json({
    success: true,
    message: 'Assignment uploaded successfully.',
    assignment: newAssignment
  });
});

// STUDENT MARKS COMPLETE OR NOT
router.patch('/assignments/:id/toggle-complete', (req, res) => {
  const { studentId } = req.body;
  const user = getReqUser(req);
  const targetStudentId = studentId || (user?.role === 'student' ? user.id : 'stu-1');

  const key = `${targetStudentId}_${req.params.id}`;
  const currentStatus = Boolean(inMemoryStore.completions[key]);
  const newStatus = !currentStatus;

  inMemoryStore.completions[key] = newStatus;

  res.json({
    success: true,
    assignmentId: req.params.id,
    studentId: targetStudentId,
    isCompleted: newStatus,
    message: newStatus ? 'Assignment marked as completed!' : 'Assignment marked as pending.'
  });
});

// -------------------------------------------------------------
// TIMETABLE (SEPARATE STUDENT TIMETABLE & TEACHER TIMETABLE)
// -------------------------------------------------------------
router.get('/timetable', (req, res) => {
  const user = getReqUser(req);
  const { role, teacherId } = req.query;

  const targetRole = role || user?.role || 'student';

  if (targetRole === 'teacher') {
    const tId = teacherId || user?.id || 'fac-1';
    const schedule = inMemoryStore.teacherTimetables[tId] || inMemoryStore.teacherTimetables['fac-1'] || [];
    return res.json({ timetable: schedule, role: 'teacher', teacherId: tId });
  }

  // Student timetable
  res.json({ timetable: inMemoryStore.studentTimetable, role: 'student' });
});

// -------------------------------------------------------------
// COURSES & STUDENTS LIST
// -------------------------------------------------------------
router.get('/courses', (req, res) => {
  res.json({ courses: inMemoryStore.courses });
});

router.get('/students', (req, res) => {
  res.json({ students: inMemoryStore.students });
});

export default router;
