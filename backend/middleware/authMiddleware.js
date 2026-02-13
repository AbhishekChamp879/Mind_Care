import { verifyToken, extractTokenFromRequest } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';
import { User } from '../models/user.js';

export const requireAuth = (roles = []) => async (req, res, next) => {
  try {
    // Extract token from cookie or Authorization header
    const token = extractTokenFromRequest(req);

    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    // Verify token
    const decoded = verifyToken(token, 'access');

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(new AppError('User no longer exists or is inactive.', 401));
    }

    // Check role-based access
    if (roles.length && !roles.includes(decoded.role)) {
      return next(new AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403));
    }

    // Attach user to request
    req.user = decoded;

    // Update last active timestamp (async, don't wait)
    user.updateLastActive().catch(err => console.error('Failed to update lastActive:', err));

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please log in again.', 401));
    }
    return next(new AppError('Authentication failed.', 401));
  }
};

