const API_BASE = 'http://localhost:5000/api';

/**
 * Standard fetch wrapper with auth header
 */
async function apiRequest(endpoint, options = {}) {
  const user = JSON.parse(localStorage.getItem('unisync_active_user') || 'null');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(user ? { 'x-user-id': user.id } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

// Authentication
export const getUsers = () => apiRequest('/auth/users');

export const loginUser = (credentials) => apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

export const registerUser = (userData) => apiRequest('/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData)
});

// Attendance
export const getAttendance = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/attendance${query ? `?${query}` : ''}`);
};

export const markAttendance = (data) => apiRequest('/attendance/mark', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Internal Gradebook
export const getMarks = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/marks${query ? `?${query}` : ''}`);
};

export const saveMarks = (data) => apiRequest('/marks/save', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Assignments
export const getAssignments = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/assignments${query ? `?${query}` : ''}`);
};

export const uploadAssignment = (data) => apiRequest('/assignments', {
  method: 'POST',
  body: JSON.stringify(data)
});

export const toggleAssignmentComplete = (assignmentId, studentId) => apiRequest(`/assignments/${assignmentId}/toggle-complete`, {
  method: 'PATCH',
  body: JSON.stringify({ studentId })
});

// Timetable
export const getTimetable = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/timetable${query ? `?${query}` : ''}`);
};

// Courses & Students
export const getCourses = () => apiRequest('/courses');
export const getStudents = () => apiRequest('/students');
