# ABTalks - Start Your Coding Journey

**60 Days. Build. Understand. Grow.**

ABTalks is a mobile-first competitive coding and developer-growth platform. Write code, see it execute step-by-step, prove your skills, and build a public developer journey.

## Features

- **Daily Coding Challenges** - 60-day structured journey with curated problems
- **Code Visualization** - Watch your actual code execute step-by step
- **Multi-Language Support** - Python, JavaScript, C++
- **GitHub Automation** - Auto-commit solutions, update README
- **Achievement System** - Earn XP, streaks, and unlock achievements
- **LinkedIn Integration** - Auto-publish achievements
- **Leaderboard** - Compete with other developers
- **Mobile-First Design** - Liquid morphism glass UI, optimized for 390px

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Monaco Editor
- Framer Motion
- Lucide React

### Backend
- Node.js + Express
- TypeScript
- Mongoose (MongoDB)
- Zod validation
- Sharp (image generation)

### External Services
- Judge0 (code execution)
- GitHub API
- LinkedIn API
- MongoDB Atlas

## Project Structure

```
abtalks/
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   ├── lib/       # API client, utilities
│   │   ├── hooks/     # Custom hooks
│   │   └── types/     # TypeScript types
│   └── package.json
├── backend/           # Express backend
│   ├── src/
│   │   ├── config/    # Environment, DB config
│   │   ├── models/    # Mongoose models
│   │   ├── routes/    # Express routes
│   │   ├── controllers/# Route handlers
│   │   ├── services/  # Business logic
│   │   ├── providers/ # External API abstractions
│   │   └── utils/     # Helpers
│   └── package.json
├── README.md
└── .gitignore
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables

```bash
# Backend
cp .env.example .env
# Edit .env with your values

# Frontend
# Create frontend/.env.local
echo NEXT_PUBLIC_API_URL=http://localhost:5000 > frontend/.env.local
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

### 4. Start Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Student dashboard |
| `/day/[day]` | Coding challenge page |
| `/challenges` | Challenge library |
| `/journey` | 60-day timeline |
| `/leaderboard` | Rankings |
| `/profile` | User profile |
| `/settings` | App settings |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/challenges` | List challenges |
| GET | `/api/challenges/day/:day` | Get challenge by day |
| POST | `/api/code/run` | Execute code |
| POST | `/api/code/visualize` | Generate execution trace |
| POST | `/api/submissions/submit` | Submit solution |
| GET | `/api/progress` | Get user progress |
| GET | `/api/leaderboard` | Get leaderboard |
| GET | `/api/achievements` | Get achievements |
| GET/POST | `/api/github/*` | GitHub integration |
| GET/POST | `/api/linkedin/*` | LinkedIn integration |

## Demo Mode

All external services (Judge0, GitHub, LinkedIn) work in **demo mode** without real credentials:

- `JUDGE0_API_KEY=demo` - Returns mock execution results
- `GITHUB_CLIENT_ID=demo` - Returns mock GitHub connection
- `LINKEDIN_MODE=demo` - Returns mock LinkedIn posts

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npx vercel
```

### Backend (Render)
- Create a Web Service on Render
- Set environment variables
- Build command: `npm run build`
- Start command: `npm start`

### Database
- Create a free cluster on [MongoDB Atlas](https://mongodb.com/atlas)
- Update `MONGODB_URI` in backend `.env`

## License

MIT
