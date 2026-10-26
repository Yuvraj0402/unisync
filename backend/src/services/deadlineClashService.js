/**
 * Deadline Clash Detector
 * Identifies overlapping assignment & assessment deadlines within configurable hour windows (e.g. 24h, 48h)
 * and generates workload alerts with recommendations.
 */

export function detectDeadlineClashes(assignments, thresholdHours = 36) {
  const clashes = [];
  const sorted = [...assignments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const a1 = sorted[i];
      const a2 = sorted[j];

      const d1 = new Date(a1.dueDate);
      const d2 = new Date(a2.dueDate);

      const diffInMs = Math.abs(d2.getTime() - d1.getTime());
      const diffInHours = diffInMs / (1000 * 60 * 60);

      if (diffInHours <= thresholdHours) {
        const isSameDay = d1.toDateString() === d2.toDateString();
        let severity = 'CRITICAL';
        if (diffInHours > 24) {
          severity = 'MODERATE';
        } else if (diffInHours <= 12 || isSameDay) {
          severity = 'CRITICAL';
        } else {
          severity = 'HIGH';
        }

        // Suggested alternate date: +2 days after the second assignment
        const suggestedDate = new Date(d2.getTime() + (48 * 60 * 60 * 1000));

        clashes.push({
          id: `clash-${a1.id}-${a2.id}`,
          severity,
          differenceHours: Math.round(diffInHours),
          isSameDay,
          assignmentA: {
            id: a1.id,
            title: a1.title,
            courseCode: a1.courseCode,
            facultyName: a1.facultyName,
            dueDate: a1.dueDate
          },
          assignmentB: {
            id: a2.id,
            title: a2.title,
            courseCode: a2.courseCode,
            facultyName: a2.facultyName,
            dueDate: a2.dueDate
          },
          reason: isSameDay
            ? `Two major academic deliverables scheduled on the exact same date (${d1.toLocaleDateString()})`
            : `Deadlines separated by only ${Math.round(diffInHours)} hours, creating severe cognitive and assessment overload`,
          suggestion: `Recommend shifting ${a2.courseCode} deadline to ${suggestedDate.toLocaleDateString()} to balance student workload.`
        });
      }
    }
  }

  return {
    totalClashes: clashes.length,
    criticalCount: clashes.filter(c => c.severity === 'CRITICAL').length,
    moderateCount: clashes.filter(c => c.severity === 'MODERATE' || c.severity === 'HIGH').length,
    clashes,
    evaluatedAt: new Date().toISOString()
  };
}

/**
 * Checks if a newly proposed assignment will clash with existing assignments
 */
export function validateNewAssignmentDeadline(newDueDate, existingAssignments, excludeId = null, thresholdHours = 36) {
  const newDate = new Date(newDueDate);
  const potentialClashes = [];

  existingAssignments
    .filter(a => a.id !== excludeId)
    .forEach(item => {
      const itemDate = new Date(item.dueDate);
      const diffInHours = Math.abs(newDate.getTime() - itemDate.getTime()) / (1000 * 60 * 60);

      if (diffInHours <= thresholdHours) {
        potentialClashes.push({
          conflictingAssignment: item.title,
          courseCode: item.courseCode,
          dueDate: item.dueDate,
          diffHours: Math.round(diffInHours)
        });
      }
    });

  return {
    hasClash: potentialClashes.length > 0,
    clashCount: potentialClashes.length,
    conflicts: potentialClashes
  };
}
