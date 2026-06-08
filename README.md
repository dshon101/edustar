# ⚡ EduStar AI

AI-powered learning platform for African students — free curriculum-aligned lessons, textbooks, an AI tutor, and interactive quizzes in one place.

## Live Site

[https://edustar-2v3b.onrender.com](https://edustar-2v3b.onrender.com)

## GitHub

[https://github.com/dshon101/edustar](https://github.com/dshon101/edustar)

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** PostgreSQL (hosted on Render)
- **Templating:** EJS
- **Auth:** bcrypt + JWT stored in localStorage
- **AI:** Groq (llama-3.1-8b-instant) with OpenAI GPT-4o-mini as optional upgrade

## Pages

| Page | URL | Description |
|---|---|---|
| Home | / | Landing page with country support info |
| Portal | /portal | Register and login |
| Dashboard | /dashboard | Student progress, XP bar, quick actions |
| Subjects | /subjects | Browse subjects by category |
| Lesson | /lesson | AI tutor chat |
| Quiz | /quiz | AI-generated quizzes with XP rewards |
| Books | /books | Free textbooks filtered by country and subject |
| About | /about | Mission and supported curricula |

## Local Setup

1. Clone the repo
```bash
git clone https://github.com/dshon101/edustar.git
cd edustar
```

2. Install dependencies
```bash
npm install
```

3. Copy the example env file and fill in your values
```bash
cp .env.example .env
```

4. Set up the database — open pgAdmin4 and run `src/setup.sql` on your PostgreSQL database

5. Start the development server
```bash
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `JWT_SECRET` | ✅ Yes | Secret key for signing JWTs |
| `GROQ_API_KEY` | ✅ Yes | Free API key from console.groq.com |
| `PORT` | No | Server port (default 3000) |
| `NODE_ENV` | No | `development` or `production` |
| `OPENAI_API_KEY` | No | Optional upgrade from Groq |

## Project Structure

edustar/
├── server.js                  ← Express entry point
├── src/
│   ├── routes.js              ← All page and API routes
│   ├── setup.sql              ← PostgreSQL schema
│   ├── controllers/
│   │   ├── auth.js            ← Register, login, JWT
│   │   ├── ai.js              ← Groq AI tutor endpoint
│   │   ├── books.js           ← Books page and API
│   │   └── pages.js           ← Simple page renderers
│   ├── models/
│   │   ├── db.js              ← PostgreSQL pool
│   │   ├── users.js           ← User queries
│   │   └── books.js           ← Book queries
│   ├── views/
│   │   ├── partials/          ← header.ejs, footer.ejs
│   │   ├── home.ejs
│   │   ├── portal.ejs
│   │   ├── dashboard.ejs
│   │   ├── subjects.ejs
│   │   ├── lesson.ejs
│   │   ├── quiz.ejs
│   │   ├── books.ejs
│   │   ├── about.ejs
│   │   └── error.ejs
│   └── public/
│       ├── styles/            ← normalize.css, small.css, large.css
│       └── scripts/           ← data.js, nav.js
├── .env.example
├── package.json
└── nodemon.json

## Supported Curricula
🇿🇼 ZIMSEC · 🇿🇲 ECZ · 🇳🇬 WAEC/NECO · 🇰🇪 KCSE/CBC · 🇹🇿 NECTA · 🇺🇬 UNEB · 🇬🇭 WASSCE · 🇿🇦 CAPS/NSC · 🇷🇼 REB

## Author
Demetrious Shoniwa — WDD 330 Final Project — BYU-Pathway Worldwide