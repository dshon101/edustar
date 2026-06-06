# ⚡ EduStar AI

AI-powered learning platform for African students — free curriculum-aligned lessons, textbooks, and an AI tutor in one place.

## Live Site

[https://your-app.onrender.com](https://your-app.onrender.com) ← replace with your actual Render URL

## Tech Stack

- **Backend:** Node.js + Express
- **Database:** PostgreSQL (hosted on Render)
- **Templating:** EJS
- **Auth:** bcrypt + JWT
- **AI:** Pollinations.ai (free) with OpenAI GPT-4o-mini as optional upgrade

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
| `PORT` | No | Server port (default 3000) |
| `NODE_ENV` | No | `development` or `production` |
| `OPENAI_API_KEY` | No | Uses Pollinations.ai for free if not set |

## Project Structure