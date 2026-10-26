export const sampleDepartments = [
  { id: 'dept-cse', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Elena Rostova', studentCount: 240, facultyCount: 18 },
  { id: 'dept-aids', name: 'Artificial Intelligence & Data Science', code: 'AIDS', hod: 'Prof. Marcus Sterling', studentCount: 180, facultyCount: 14 },
  { id: 'dept-it', name: 'Information Technology', code: 'IT', hod: 'Dr. Priya Sharma', studentCount: 210, facultyCount: 16 }
];

export const sampleFaculty = [
  {
    id: 'fac-1',
    name: 'Dr. Elena Rostova',
    email: 'teacher.elena@unisync.edu',
    password: 'password123',
    department: 'Computer Science & Engineering',
    role: 'teacher',
    designation: 'Professor & HOD',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialization: 'Distributed Database Systems',
    coursesAssigned: ['CS301']
  },
  {
    id: 'fac-2',
    name: 'Prof. Alan Vance',
    email: 'teacher.alan@unisync.edu',
    password: 'password123',
    department: 'Computer Science & Engineering',
    role: 'teacher',
    designation: 'Associate Professor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialization: 'Operating Systems & Concurrency',
    coursesAssigned: ['CS302']
  },
  {
    id: 'fac-3',
    name: 'Dr. Priya Sharma',
    email: 'teacher.priya@unisync.edu',
    password: 'password123',
    department: 'Information Technology',
    role: 'teacher',
    designation: 'Assistant Professor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    specialization: 'Modern Web Engineering',
    coursesAssigned: ['CS303']
  }
];

export const sampleCourses = [
  {
    code: 'CS301',
    name: 'Database Management Systems',
    department: 'CSE',
    semester: 5,
    credits: 4,
    facultyId: 'fac-1',
    facultyName: 'Dr. Elena Rostova',
    room: 'Hall 301',
    schedule: 'Mon, Wed 09:00 - 10:30'
  },
  {
    code: 'CS302',
    name: 'Operating Systems & Concurrency',
    department: 'CSE',
    semester: 5,
    credits: 4,
    facultyId: 'fac-2',
    facultyName: 'Prof. Alan Vance',
    room: 'Hall 304',
    schedule: 'Tue, Thu 11:00 - 12:30'
  },
  {
    code: 'CS303',
    name: 'Web Engineering & Cloud Architecture',
    department: 'CSE',
    semester: 5,
    credits: 4,
    facultyId: 'fac-3',
    facultyName: 'Dr. Priya Sharma',
    room: 'Computer Lab 3',
    schedule: 'Mon, Thu 14:00 - 15:30'
  }
];

export const sampleStudents = [
  {
    id: 'stu-1',
    rollNumber: 'CS2024-001',
    name: 'Aarav Patel',
    email: 'student.aarav@unisync.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: 5,
    cgpa: 8.85,
    enrolledCourses: ['CS301', 'CS302', 'CS303']
  },
  {
    id: 'stu-2',
    rollNumber: 'CS2024-042',
    name: 'Zara Khan',
    email: 'student.zara@unisync.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: 5,
    cgpa: 7.20,
    enrolledCourses: ['CS301', 'CS302', 'CS303']
  },
  {
    id: 'stu-3',
    rollNumber: 'CS2024-019',
    name: 'Rohan Gupta',
    email: 'student.rohan@unisync.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: 5,
    cgpa: 7.90,
    enrolledCourses: ['CS301', 'CS302', 'CS303']
  },
  {
    id: 'stu-4',
    rollNumber: 'CS2024-008',
    name: 'Meera Nair',
    email: 'student.meera@unisync.edu',
    password: 'password123',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    semester: 5,
    cgpa: 9.40,
    enrolledCourses: ['CS301', 'CS302', 'CS303']
  }
];

export const sampleAssignments = [
  {
    id: 'asg-1',
    title: 'Relational Schema Normalization & Complex SQL Queries',
    courseCode: 'CS301',
    courseName: 'Database Management Systems',
    facultyId: 'fac-1',
    facultyName: 'Dr. Elena Rostova',
    dueDate: '2026-11-02T23:59:00',
    totalMarks: 50,
    description: 'Design BCNF normalized tables for an e-commerce platform and write 5 optimized queries with indexed joins.'
  },
  {
    id: 'asg-2',
    title: 'Multi-threaded CPU Scheduler & Deadlock Avoidance',
    courseCode: 'CS302',
    courseName: 'Operating Systems & Concurrency',
    facultyId: 'fac-2',
    facultyName: 'Prof. Alan Vance',
    dueDate: '2026-11-05T18:00:00',
    totalMarks: 50,
    description: 'Implement Round Robin and Priority scheduling simulation in C/C++ with Banker deadlock avoidance.'
  },
  {
    id: 'asg-3',
    title: 'Full-Stack RESTful API with Authentication',
    courseCode: 'CS303',
    courseName: 'Web Engineering & Cloud Architecture',
    facultyId: 'fac-3',
    facultyName: 'Dr. Priya Sharma',
    dueDate: '2026-11-08T23:59:00',
    totalMarks: 100,
    description: 'Build modular Express controllers, secure JWT auth tokens, and responsive frontend dashboard.'
  }
];

// Student completion statuses: { 'stuId_asgId': boolean }
export const sampleCompletions = {
  'stu-1_asg-1': true,
  'stu-1_asg-2': false,
  'stu-1_asg-3': false,
  'stu-2_asg-1': true,
  'stu-2_asg-2': true,
  'stu-2_asg-3': false,
  'stu-3_asg-1': false,
  'stu-4_asg-1': true,
  'stu-4_asg-2': true,
  'stu-4_asg-3': true
};

export const sampleAttendance = [
  // Aarav Patel (stu-1)
  { studentId: 'stu-1', courseCode: 'CS301', attended: 26, total: 28, percentage: 92.8 },
  { studentId: 'stu-1', courseCode: 'CS302', attended: 25, total: 28, percentage: 89.3 },
  { studentId: 'stu-1', courseCode: 'CS303', attended: 27, total: 28, percentage: 96.4 },

  // Zara Khan (stu-2)
  { studentId: 'stu-2', courseCode: 'CS301', attended: 23, total: 28, percentage: 82.1 },
  { studentId: 'stu-2', courseCode: 'CS302', attended: 21, total: 28, percentage: 75.0 },
  { studentId: 'stu-2', courseCode: 'CS303', attended: 24, total: 28, percentage: 85.7 },

  // Rohan Gupta (stu-3)
  { studentId: 'stu-3', courseCode: 'CS301', attended: 21, total: 28, percentage: 75.0 },
  { studentId: 'stu-3', courseCode: 'CS302', attended: 22, total: 28, percentage: 78.5 },
  { studentId: 'stu-3', courseCode: 'CS303', attended: 20, total: 28, percentage: 71.4 },

  // Meera Nair (stu-4)
  { studentId: 'stu-4', courseCode: 'CS301', attended: 28, total: 28, percentage: 100.0 },
  { studentId: 'stu-4', courseCode: 'CS302', attended: 27, total: 28, percentage: 96.4 },
  { studentId: 'stu-4', courseCode: 'CS303', attended: 27, total: 28, percentage: 96.4 }
];

export const sampleMarks = [
  // Aarav Patel
  { studentId: 'stu-1', courseCode: 'CS301', midterm: 44, quiz: 18, assignment: 47, totalPercentage: 90.8, grade: 'A+' },
  { studentId: 'stu-1', courseCode: 'CS302', midterm: 41, quiz: 17, assignment: 45, totalPercentage: 85.8, grade: 'A' },
  { studentId: 'stu-1', courseCode: 'CS303', midterm: 47, quiz: 19, assignment: 49, totalPercentage: 95.8, grade: 'O' },

  // Zara Khan
  { studentId: 'stu-2', courseCode: 'CS301', midterm: 38, quiz: 15, assignment: 40, totalPercentage: 77.5, grade: 'B+' },
  { studentId: 'stu-2', courseCode: 'CS302', midterm: 35, quiz: 14, assignment: 38, totalPercentage: 72.5, grade: 'B' },
  { studentId: 'stu-2', courseCode: 'CS303', midterm: 42, quiz: 16, assignment: 44, totalPercentage: 85.0, grade: 'A' },

  // Rohan Gupta
  { studentId: 'stu-3', courseCode: 'CS301', midterm: 32, quiz: 14, assignment: 35, totalPercentage: 67.5, grade: 'B' },
  { studentId: 'stu-3', courseCode: 'CS302', midterm: 36, quiz: 15, assignment: 38, totalPercentage: 74.1, grade: 'B' },
  { studentId: 'stu-3', courseCode: 'CS303', midterm: 35, quiz: 15, assignment: 36, totalPercentage: 71.6, grade: 'B' },

  // Meera Nair
  { studentId: 'stu-4', courseCode: 'CS301', midterm: 49, quiz: 20, assignment: 50, totalPercentage: 99.1, grade: 'O' },
  { studentId: 'stu-4', courseCode: 'CS302', midterm: 46, quiz: 19, assignment: 48, totalPercentage: 94.1, grade: 'O' },
  { studentId: 'stu-4', courseCode: 'CS303', midterm: 48, quiz: 20, assignment: 50, totalPercentage: 98.3, grade: 'O' }
];

// Student timetable: all enrolled classes
export const sampleStudentTimetable = [
  { id: 'st-1', day: 'Monday', time: '09:00 - 10:30', courseCode: 'CS301', courseName: 'Database Management Systems', room: 'Hall 301', faculty: 'Dr. Elena Rostova', type: 'Lecture' },
  { id: 'st-2', day: 'Monday', time: '14:00 - 15:30', courseCode: 'CS303', courseName: 'Web Engineering & Cloud', room: 'Computer Lab 3', faculty: 'Dr. Priya Sharma', type: 'Lab' },
  
  { id: 'st-3', day: 'Tuesday', time: '11:00 - 12:30', courseCode: 'CS302', courseName: 'Operating Systems & Concurrency', room: 'Hall 304', faculty: 'Prof. Alan Vance', type: 'Lecture' },
  { id: 'st-4', day: 'Tuesday', time: '14:00 - 15:30', courseCode: 'CS301', courseName: 'DBMS Query Lab', room: 'Lab 2', faculty: 'Dr. Elena Rostova', type: 'Lab' },

  { id: 'st-5', day: 'Wednesday', time: '09:00 - 10:30', courseCode: 'CS301', courseName: 'Database Management Systems', room: 'Hall 301', faculty: 'Dr. Elena Rostova', type: 'Lecture' },

  { id: 'st-6', day: 'Thursday', time: '11:00 - 12:30', courseCode: 'CS302', courseName: 'Operating Systems & Concurrency', room: 'Hall 304', faculty: 'Prof. Alan Vance', type: 'Lecture' },
  { id: 'st-7', day: 'Thursday', time: '14:00 - 15:30', courseCode: 'CS303', courseName: 'Web Engineering & Cloud', room: 'Computer Lab 3', faculty: 'Dr. Priya Sharma', type: 'Lecture' },

  { id: 'st-8', day: 'Friday', time: '10:00 - 12:00', courseCode: 'CS302', courseName: 'OS Kernel Programming Lab', room: 'Lab 4', faculty: 'Prof. Alan Vance', type: 'Lab' }
];

// Teacher timetables: keyed by facultyId
export const sampleTeacherTimetables = {
  'fac-1': [
    { id: 'tt-fac1-1', day: 'Monday', time: '09:00 - 10:30', courseCode: 'CS301', courseName: 'Database Management Systems', room: 'Hall 301', classBatch: 'CS 5th Sem (Batch A)', type: 'Lecture' },
    { id: 'tt-fac1-2', day: 'Tuesday', time: '14:00 - 15:30', courseCode: 'CS301', courseName: 'DBMS Query Lab', room: 'Lab 2', classBatch: 'CS 5th Sem (Batch B)', type: 'Lab' },
    { id: 'tt-fac1-3', day: 'Wednesday', time: '09:00 - 10:30', courseCode: 'CS301', courseName: 'Database Management Systems', room: 'Hall 301', classBatch: 'CS 5th Sem (Batch A)', type: 'Lecture' }
  ],
  'fac-2': [
    { id: 'tt-fac2-1', day: 'Tuesday', time: '11:00 - 12:30', courseCode: 'CS302', courseName: 'Operating Systems & Concurrency', room: 'Hall 304', classBatch: 'CS 5th Sem', type: 'Lecture' },
    { id: 'tt-fac2-2', day: 'Thursday', time: '11:00 - 12:30', courseCode: 'CS302', courseName: 'Operating Systems & Concurrency', room: 'Hall 304', classBatch: 'CS 5th Sem', type: 'Lecture' },
    { id: 'tt-fac2-3', day: 'Friday', time: '10:00 - 12:00', courseCode: 'CS302', courseName: 'OS Kernel Programming Lab', room: 'Lab 4', classBatch: 'CS 5th Sem (Lab A)', type: 'Lab' }
  ],
  'fac-3': [
    { id: 'tt-fac3-1', day: 'Monday', time: '14:00 - 15:30', courseCode: 'CS303', courseName: 'Web Engineering & Cloud', room: 'Computer Lab 3', classBatch: 'CS 5th Sem', type: 'Lab' },
    { id: 'tt-fac3-2', day: 'Thursday', time: '14:00 - 15:30', courseCode: 'CS303', courseName: 'Web Engineering & Cloud', room: 'Computer Lab 3', classBatch: 'CS 5th Sem', type: 'Lecture' }
  ]
};

export const sampleUsers = [
  ...sampleFaculty,
  ...sampleStudents
];
