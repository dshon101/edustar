import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser, getUserById } from '../models/users.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_production';
const SALT_ROUNDS = 10;

// Show login/register page
const showPortalPage = (req, res) => {
    res.render('portal', { title: 'Join EduStar', metaDesc: 'Sign in or create your free EduStar account.' });
};

// Register a new user
const register = async (req, res) => {
    const { name, email, password, country, grade } = req.body;
    try {
        const existing = await getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ ok: false, error: 'An account with this email already exists.' });
        }
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await createUser(name, email, passwordHash, country, grade);
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ ok: true, token, user });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ ok: false, error: 'Registration failed. Please try again.' });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
        }
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
        // Don't send password_hash to client
        const { password_hash, ...safeUser } = user;
        res.json({ ok: true, token, user: safeUser });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ ok: false, error: 'Login failed. Please try again.' });
    }
};

// Get current user (used by frontend on page load)
const getMe = async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '') || req.query._token;
        if (!token) return res.status(401).json({ ok: false, error: 'No token' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await getUserById(decoded.id);
        if (!user) return res.status(401).json({ ok: false, error: 'User not found' });

        res.json({ ok: true, user });
    } catch (error) {
        res.status(401).json({ ok: false, error: 'Invalid token' });
    }
};

export { showPortalPage, register, login, getMe };
