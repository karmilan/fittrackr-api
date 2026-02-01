import User from './user.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.utils.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({
                message: 'Please provide email, password, and name'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User with this email already exists'
            });
        }

        // Create new user (password will be hashed by pre-save hook)
        const user = new User({
            email,
            password,
            name
        });

        await user.save();

        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return user and access token
        res.status(201).json({
            message: 'User registered successfully',
            user: user.toJSON(),
            accessToken
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Return user and access token
        res.json({
            message: 'Login successful',
            user: user.toJSON(),
            accessToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshToken = async (req, res) => {
    try {
        // Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: 'Refresh token not found',
                error: 'MISSING_REFRESH_TOKEN'
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Verify user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                error: 'USER_NOT_FOUND'
            });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id.toString());

        res.json({
            message: 'Token refreshed successfully',
            accessToken
        });
    } catch (error) {
        console.error('Refresh token error:', error);

        // Clear invalid refresh token cookie
        res.clearCookie('refreshToken');

        if (error.message === 'Refresh token has expired') {
            return res.status(401).json({
                message: 'Refresh token has expired. Please login again.',
                error: 'REFRESH_TOKEN_EXPIRED'
            });
        }

        res.status(401).json({
            message: 'Invalid refresh token',
            error: error.message
        });
    }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
    try {
        // Clear refresh token cookie
        res.clearCookie('refreshToken');

        res.json({
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: 'Error logging out',
            error: error.message
        });
    }
};

/**
 * Get current user info
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
    try {
        // req.user is set by authenticate middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            message: 'Error fetching user',
            error: error.message
        });
    }
};
