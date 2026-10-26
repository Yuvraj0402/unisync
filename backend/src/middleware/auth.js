import { inMemoryStore, auth as firebaseAuth } from '../config/firebase.js';

/**
 * Middleware to authenticate requests via Firebase Token or Active Session Header
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const sessionUserId = req.headers['x-user-id'];

    if (sessionUserId) {
      const user = inMemoryStore.users.find(u => u.id === sessionUserId);
      if (user) {
        req.user = user;
        return next();
      }
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      if (firebaseAuth) {
        const decodedToken = await firebaseAuth.verifyIdToken(idToken);
        req.user = {
          id: decodedToken.uid,
          email: decodedToken.email,
          role: decodedToken.role || 'student'
        };
        return next();
      }
    }

    // Default fallback to Admin for smooth prototyping/testing if no header specified
    req.user = inMemoryStore.users[0]; // Admin Arthur
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ error: 'Unauthorized token or user context.' });
  }
}

/**
 * Role-Based Access Control (RBAC) Middleware
 * @param  {...string} allowedRoles - e.g. 'admin', 'teacher', 'student'
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User is not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Access requires [${allowedRoles.join(', ')}] role. Current role is '${req.user.role}'.`
      });
    }

    next();
  };
}
