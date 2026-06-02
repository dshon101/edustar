-- ================================================================
-- EduStar
-- ================================================================

-- ── USERS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120)  NOT NULL,
    email         VARCHAR(180)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    country       CHAR(3)       NOT NULL DEFAULT 'KE',
    grade         VARCHAR(30)   NOT NULL DEFAULT 'Grade 7',
    points        INT           NOT NULL DEFAULT 0,
    level         SMALLINT      NOT NULL DEFAULT 1,
    quizzes_taken INT           NOT NULL DEFAULT 0,
    is_admin      BOOLEAN       NOT NULL DEFAULT false,
    is_active     BOOLEAN       NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    last_login    TIMESTAMPTZ   DEFAULT NULL
);

-- ── BOOKS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
    id             SERIAL PRIMARY KEY,
    book_key       VARCHAR(60)   NOT NULL UNIQUE,
    title          VARCHAR(220)  NOT NULL,
    subject        VARCHAR(40)   NOT NULL,
    country        VARCHAR(20)   NOT NULL DEFAULT 'continental',
    grade_range    VARCHAR(30)   NOT NULL,
    description    TEXT          DEFAULT NULL,
    url            VARCHAR(500)  DEFAULT NULL,
    icon           VARCHAR(10)   DEFAULT '📚',
    download_count INT           NOT NULL DEFAULT 0,
    is_active      BOOLEAN       NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ── COMPLETED LESSONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS completed_lessons (
    id            SERIAL PRIMARY KEY,
    user_id       INT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id     VARCHAR(60)   NOT NULL,
    subject_id    VARCHAR(40)   NOT NULL,
    points_earned SMALLINT      NOT NULL DEFAULT 0,
    completed_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- ── QUIZ SCORES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_scores (
    id            SERIAL PRIMARY KEY,
    user_id       INT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id    VARCHAR(40)   NOT NULL,
    subject_name  VARCHAR(80)   NOT NULL,
    score_pct     SMALLINT      NOT NULL,
    points_earned SMALLINT      NOT NULL DEFAULT 0,
    correct       SMALLINT      NOT NULL DEFAULT 0,
    total         SMALLINT      NOT NULL DEFAULT 0,
    taken_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
