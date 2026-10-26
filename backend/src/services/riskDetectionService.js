/**
 * Smart Academic Risk Detection System
 * Analyzes attendance %, internal assessment marks, assignment submissions,
 * and academic trends with configurable thresholds.
 */

// Default configurable thresholds
export const defaultRiskConfig = {
  minAttendanceWarning: 75, // Below 75% = Warning / Medium risk
  minAttendanceCritical: 65, // Below 65% = High risk
  minPassingMarksPercent: 50, // Below 50% = Academic concern
  maxAllowedMissedAssignments: 1, // > 1 missed assignment triggers warning
  weights: {
    attendance: 0.40,
    marks: 0.45,
    assignments: 0.15
  }
};

/**
 * Calculates student risk diagnostics given student data, attendance records, marks, and assignments.
 */
export function evaluateStudentRisk(student, attendanceList, marksList, assignmentsList, config = defaultRiskConfig) {
  const studentAttendance = attendanceList.filter(a => a.studentId === student.id);
  const studentMarks = marksList.filter(m => m.studentId === student.id);

  // 1. Attendance Analysis
  let totalAttended = 0;
  let totalLectures = 0;
  const courseAttendanceIssues = [];

  studentAttendance.forEach(record => {
    totalAttended += record.attended;
    totalLectures += record.total;
    if (record.percentage < config.minAttendanceWarning) {
      courseAttendanceIssues.push({
        course: record.courseCode,
        percentage: record.percentage,
        isCritical: record.percentage < config.minAttendanceCritical
      });
    }
  });

  const overallAttendancePercent = totalLectures > 0 ? (totalAttended / totalLectures) * 100 : 100;

  // 2. Academic Marks Analysis
  let totalMarksObtained = 0;
  let totalMaxMarks = 0;
  const courseMarksIssues = [];

  studentMarks.forEach(record => {
    const totalSubjectMarks = record.midterm + record.quiz + record.assignment;
    const maxSubjectMarks = record.maxMidterm + record.maxQuiz + record.maxAssignment;
    totalMarksObtained += totalSubjectMarks;
    totalMaxMarks += maxSubjectMarks;

    const subjectPercent = maxSubjectMarks > 0 ? (totalSubjectMarks / maxSubjectMarks) * 100 : 100;
    if (subjectPercent < config.minPassingMarksPercent) {
      courseMarksIssues.push({
        course: record.courseCode,
        percentage: subjectPercent,
        grade: record.grade,
        midterm: record.midterm,
        maxMidterm: record.maxMidterm
      });
    }
  });

  const overallMarksPercent = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 100;

  // 3. Assignment Submissions Analysis
  // Check student mark submissions or missing flags
  let missedAssignmentsCount = 0;
  studentMarks.forEach(m => {
    if (m.assignment < (m.maxAssignment * 0.4)) {
      missedAssignmentsCount += 1;
    }
  });

  // 4. Calculate Risk Score (0 = No Risk, 100 = Severe Risk)
  const attendanceDeficit = Math.max(0, 100 - overallAttendancePercent); // 0 to 100
  const marksDeficit = Math.max(0, 100 - overallMarksPercent); // 0 to 100
  const assignmentDeficit = Math.min(100, (missedAssignmentsCount / 3) * 100);

  const riskScore = Math.round(
    (attendanceDeficit * config.weights.attendance) +
    (marksDeficit * config.weights.marks) +
    (assignmentDeficit * config.weights.assignments)
  );

  // 5. Determine Risk Level & Diagnostic Factors
  let riskLevel = 'LOW';
  const factors = [];
  const interventions = [];

  if (overallAttendancePercent < config.minAttendanceCritical) {
    factors.push(`Critical overall attendance at ${overallAttendancePercent.toFixed(1)}% (Institutional min: ${config.minAttendanceWarning}%)`);
  } else if (overallAttendancePercent < config.minAttendanceWarning) {
    factors.push(`Borderline overall attendance at ${overallAttendancePercent.toFixed(1)}%`);
  }

  courseAttendanceIssues.forEach(c => {
    factors.push(`Sub-threshold attendance in ${c.course} (${c.percentage.toFixed(1)}%)`);
  });

  courseMarksIssues.forEach(m => {
    factors.push(`Failing internal performance in ${m.course} (${m.percentage.toFixed(1)}% - Midterm: ${m.midterm}/${m.maxMidterm})`);
  });

  if (missedAssignmentsCount > config.maxAllowedMissedAssignments) {
    factors.push(`${missedAssignmentsCount} incomplete/severely low-scoring practical assignments`);
  }

  if (riskScore >= 45 || overallAttendancePercent < config.minAttendanceCritical || courseMarksIssues.length >= 2) {
    riskLevel = 'HIGH';
    interventions.push('Mandatory 1-on-1 Faculty Mentoring Session');
    interventions.push('Issue Formal Academic Probation Notice to Student & Guardian');
    interventions.push('Enroll in Remedial Doubt-Solving & Lab Makeup Cohort');
  } else if (riskScore >= 25 || overallAttendancePercent < config.minAttendanceWarning || courseMarksIssues.length === 1) {
    riskLevel = 'MEDIUM';
    interventions.push('Schedule Academic Advisory check-in within 7 days');
    interventions.push('Assign Peer Tutor for problem subjects');
    interventions.push('Set milestone-based assignment submission schedule');
  } else {
    riskLevel = 'LOW';
    interventions.push('Maintain regular academic progress and seminar participation');
  }

  return {
    studentId: student.id,
    name: student.name,
    rollNumber: student.rollNumber,
    department: student.department,
    semester: student.semester,
    avatar: student.avatar,
    riskScore,
    riskLevel,
    metrics: {
      overallAttendancePercent: parseFloat(overallAttendancePercent.toFixed(1)),
      overallMarksPercent: parseFloat(overallMarksPercent.toFixed(1)),
      missedAssignmentsCount,
      cgpa: student.cgpa
    },
    diagnosticFactors: factors.length > 0 ? factors : ['Satisfactory academic standing across all subjects'],
    recommendedInterventions: interventions,
    lastEvaluated: new Date().toISOString()
  };
}

export function evaluateAllStudentsRisk(students, attendanceList, marksList, assignmentsList, config = defaultRiskConfig) {
  return students.map(student => evaluateStudentRisk(student, attendanceList, marksList, assignmentsList, config));
}
