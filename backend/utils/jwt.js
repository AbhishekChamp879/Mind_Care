import jwt from 'jsonwebtoken';

/**
 * Generate access token (short-lived)
 * @param {Object} user - User object
 * @returns {string} JWT access token
 */
export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );
};

/**
 * Generate refresh token (long-lived)
 * @param {Object} user - User object
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @param {string} type - 'access' or 'refresh'
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token, type = 'access') => {
    const secret = type === 'refresh'
        ? (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
        : process.env.JWT_SECRET;

    return jwt.verify(token, secret);
};

/**
 * Extract token from request (cookie or Authorization header)
 * @param {Object} req - Express request object
 * @returns {string|null} Token or null
 */
export const extractTokenFromRequest = (req) => {
    // Check cookie first
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    return null;
};
