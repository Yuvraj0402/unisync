import admin from 'firebase-admin';
import dotenv from 'dotenv';
import {
  sampleDepartments,
  sampleFaculty,
  sampleStudents,
  sampleCourses,
  sampleAssignments,
  sampleCompletions,
  sampleAttendance,
  sampleMarks,
  sampleStudentTimetable,
  sampleTeacherTimetables,
  sampleUsers
} from '../data/sampleData.js';

dotenv.config();

let db = null;
let auth = null;
let isMock = false;

// Attempt Firebase Admin SDK initialization if credentials exist
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log('✅ Firebase Admin SDK initialized with cloud credentials.');
  } else if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log('✅ Firebase Admin SDK initialized with Project ID.');
  } else {
    throw new Error('No Firebase Cloud credentials found. Operating in local Institutional Data Engine mode.');
  }
} catch (err) {
  console.log('ℹ️ ' + err.message);
  isMock = true;
}

// In-Memory Cloud Firestore Store for immediate zero-config operation
export const inMemoryStore = {
  departments: [...sampleDepartments],
  faculty: [...sampleFaculty],
  students: [...sampleStudents],
  courses: [...sampleCourses],
  assignments: [...sampleAssignments],
  completions: { ...sampleCompletions },
  attendance: [...sampleAttendance],
  marks: [...sampleMarks],
  studentTimetable: [...sampleStudentTimetable],
  teacherTimetables: { ...sampleTeacherTimetables },
  users: [...sampleUsers]
};

export { db, auth, isMock };
