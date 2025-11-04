# Getting Started

This guide will help you get the Cloud Storage application up and running on your local machine.

## Prerequisites

Make sure you have the following installed:
- Go 1.24 or higher
- Node.js 20 or higher
- npm 10 or higher

## Running the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Download dependencies:
```bash
go mod download
```

3. Build the server:
```bash
go build -o bin/server ./cmd/server
```

4. Run the server:
```bash
./bin/server
```

The backend will start on `http://localhost:8080`

## Running the Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Using the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Click "Register" to create a new account
3. Fill in the registration form with:
   - Username
   - Email
   - Password
   - Confirm Password
4. After registration, you'll be automatically logged in and redirected to the dashboard
5. In the dashboard, you can:
   - View your profile information
   - Toggle between light and dark themes using the theme button
   - Logout using the logout button

## API Endpoints

The backend provides the following endpoints:

### Public Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with existing credentials
- `GET /api/health` - Health check

### Protected Endpoints (require authentication)
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/theme` - Update theme preference

## Testing with curl

### Register a user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Get profile (replace TOKEN with the token from login):
```bash
curl -X GET http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

### Update theme:
```bash
curl -X PUT http://localhost:8080/api/auth/theme \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"theme":"dark"}'
```

## Important Notes

- This is an educational project
- User data is stored in-memory and will be lost when the server restarts
- The JWT secret key is hardcoded (should use environment variables in production)
- Not intended for production use or storing sensitive data
