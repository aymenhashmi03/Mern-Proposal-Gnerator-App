<<<<<<< HEAD
# Proposal Generator App

A full-stack web application for generating and managing proposals, built with React and Node.js.

## Features

- User authentication (Sign In / Sign Up)
- Protected dashboard
- Proposal management
- Modern UI with Tailwind CSS and Framer Motion

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React Icons

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator

## Project Structure

```
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json
│
└── backend/           # Node.js backend API
    ├── models/        # MongoDB models
    ├── routes/        # API routes
    ├── middleware/    # Custom middleware
    └── server.js      # Express server
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and the backend API on `http://localhost:5000`.

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/proposals` - Get user proposals (protected)
- `POST /api/proposals` - Create new proposal (protected)
- `GET /api/health` - Health check endpoint

## License

MIT
=======
# Mern-Proposal-Gnerator-App
This is my Full Stack Proposal Generator App
>>>>>>> d8aaa31d955de734955727b40cd8f7f75c5c4aff
