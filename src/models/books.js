import db from './db.js';

// Get all books, optionally filtered
const getAllBooks = async (filters = {}) => {
    let query = `SELECT * FROM books WHERE is_active = true`;
    const params = [];
    let i = 1;

    if (filters.country) {
        query += ` AND (country = $${i} OR country = 'continental')`;
        params.push(filters.country);
        i++;
    }
    if (filters.subject) {
        query += ` AND LOWER(subject) = LOWER($${i})`;
        params.push(filters.subject);
        i++;
    }
    if (filters.grade) {
        query += ` AND grade_range = $${i}`;
        params.push(filters.grade);
        i++;
    }

    query += ` ORDER BY subject ASC, title ASC`;

    const result = await db.query(query, params);
    return result.rows;
};

// Get a single book by its key
const getBookByKey = async (bookKey) => {
    const result = await db.query(
        'SELECT * FROM books WHERE book_key = $1 AND is_active = true',
        [bookKey]
    );
    return result.rows[0];
};

export { getAllBooks, getBookByKey };
