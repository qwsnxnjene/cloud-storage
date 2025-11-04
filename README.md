# Cloud Storage

A simplified web application for storing and managing files. This is an educational project built with React and Golang.

## Features

- User registration and authentication
- User login
- Personal dashboard
- Light/Dark theme toggle
- JWT-based authentication

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Golang
- **Authentication**: JWT tokens

## Project Structure

```
cloud-storage/
├── backend/          # Go backend server
│   ├── cmd/
│   │   └── server/   # Main server application
│   ├── internal/
│   │   ├── auth/     # Authentication logic
│   │   ├── handlers/ # HTTP handlers
│   │   └── models/   # Data models
│   └── pkg/
│       └── utils/    # Utility functions
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites

- Go 1.24 or higher
- Node.js 20 or higher
- npm 10 or higher

### Backend Setup

```bash
cd backend
go mod download
go build -o bin/server ./cmd/server
./bin/server
```

The backend server will start on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. Start the backend server
2. Start the frontend development server
3. Open your browser to `http://localhost:5173`
4. Register a new account or login
5. Access your personal dashboard
6. Toggle between light and dark themes

## Note

This is an educational project and is not intended for commercial use or storing critical data. The application uses in-memory storage for simplicity.
