import db from './db.js';

// Get a user by email
const getUserByEmail = async (email) => {
    const result = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

// Get a user by ID
const getUserById = async (id) => {
    const result = await db.query(
        `SELECT user_id, name, email, country, grade, points, level, 
         quizzes_taken, is_admin, created_at 
         FROM users WHERE user_id = $1`,
        [id]
    );
    return result.rows[0];
};

// Create a new user
const createUser = async (name, email, passwordHash, country, grade) => {
    const result = await db.query(
        `INSERT INTO users (name, email, password_hash, country, grade)
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING user_id, name, email, country, grade`,
        [name, email, passwordHash, country, grade]
    );
    return result.rows[0];
};

// Update user progress
const updateUserProgress = async (id, points, level, quizzesTaken) => {
    const result = await db.query(
        `UPDATE users SET points = $1, level = $2, quizzes_taken = $3 
         WHERE user_id = $4
         RETURNING user_id, name, email, country, grade, points, level, quizzes_taken`,
        [points, level, quizzesTaken, id]
    );
    return result.rows[0];
};

export { getUserByEmail, getUserById, createUser, updateUserProgress };