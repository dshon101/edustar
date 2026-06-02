import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import routes from './src/routes.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// ── Middleware ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

// ── Templating ───────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// ── Request logger (dev only) ────────────────────────────────────
app.use((req, res, next) => {
    if (NODE_ENV === 'development') console.log(`${req.method} ${req.url}`);
    next();
});

// ── Make NODE_ENV available in all templates ─────────────────────
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// ── Routes ───────────────────────────────────────────────────────
app.use(routes);

// ── 404 handler ──────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('error', { title: 'Page Not Found', message: 'The page you are looking for does not exist.' });
});

// ── 500 handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).render('error', { title: 'Server Error', message: 'Something went wrong. Please try again later.' });
});

// ── Start ────────────────────────────────────────────────────────
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`EduStar running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.log('Server started but DB is not connected yet.');
    }
});
