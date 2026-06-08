import express from 'express';
import { showPortalPage, register, login, getMe } from './controllers/auth.js';
import { askTutor } from './controllers/ai.js';
import { showBooksPage, getBooks } from './controllers/books.js';
import { showHomePage, showDashboardPage, showSubjectsPage, showLessonPage, showAboutPage, showQuizPage } from './controllers/pages.js';

const router = express.Router();

// ── Page routes ──────────────────────────────────────────────────
router.get('/',           showHomePage);
router.get('/dashboard',  showDashboardPage);
router.get('/subjects',   showSubjectsPage);
router.get('/lesson',     showLessonPage);
router.get('/books',      showBooksPage);
router.get('/about',      showAboutPage);
router.get('/portal',     showPortalPage);
router.get('/quiz',       showQuizPage);

// ── Auth API routes ──────────────────────────────────────────────
router.post('/api/auth/register', register);
router.post('/api/auth/login',    login);
router.get( '/api/auth/me',       getMe);

// ── AI Tutor API route ───────────────────────────────────────────
router.post('/api/ai/chat', askTutor);

// ── Books API route ──────────────────────────────────────────────
router.get('/api/books', getBooks);

export default router;
