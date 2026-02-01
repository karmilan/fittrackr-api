import { verifyAccessToken } from '../utils/jwt.utils.js';

/**
 * Authentication middleware
 * Verifies JWT access token and attaches user info to request
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Access denied. No token provided.',
                error: 'MISSING_TOKEN'
            });
        }

        // Extract token (remove 'Bearer ' prefix)
        const token = authHeader.substring(7);

        // Verify token
        const decoded = verifyAccessToken(token);

        // Attach user info to request
        req.user = {
            id: decoded.id
        };

        next();
    } catch (error) {
        // Handle specific token errors
        if (error.message === 'Access token has expired') {
            return res.status(401).json({
                message: 'Access token has expired',
                error: 'TOKEN_EXPIRED'
            });
        }

        if (error.message === 'Invalid access token') {
            return res.status(401).json({
                message: 'Invalid access token',
                error: 'INVALID_TOKEN'
            });
        }

        // Generic error
        return res.status(401).json({
            message: 'Authentication failed',
            error: error.message
        });
    }
};
