import { getAllBooks, getBookByKey } from '../models/books.js';

// Render the books page
const showBooksPage = async (req, res) => {
    const title = 'Free Textbooks';
    const metaDesc = 'Free curriculum-aligned textbooks for African students.';
    try {
        res.render('books', { title, metaDesc });
    } catch (error) {
        console.error('Error loading books page:', error);
        res.status(500).render('error', { title: 'Error', message: 'Could not load books page.' });
    }
};

// API: return books as JSON (used by frontend fetch)
const getBooks = async (req, res) => {
    try {
        const { country, subject, grade } = req.query;
        const books = await getAllBooks({ country, subject, grade });
        res.json({ ok: true, books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ ok: false, error: 'Could not load books.' });
    }
};

export { showBooksPage, getBooks };
