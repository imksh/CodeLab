# CodeLab API Documentation

The backend exposes a RESTful API under the `/api` prefix. 

**Base URL**: `http://localhost:5000/api`

## 🩺 Health Check
- `GET /api/`
  - Returns the health status and current timestamp.

## 🔐 Authentication (`/api/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Authenticate an existing user and receive a token.
- `POST /logout`: Logout the current user (Requires Auth).
- `POST /gen-otp`: Generate OTP for password reset/verification.
- `POST /verify-otp`: Verify generated OTP.
- `POST /reset-password`: Reset user password (Requires Token).
- `GET /check`: Check authentication status of current token (Requires Auth).
- `GET /stats`: Get current user statistics (Requires Auth).
- `PUT /profile`: Update user profile data, including avatar upload (Requires Auth).

## 🧩 Problems (`/api/problems`)
- `GET /`: Retrieve a list of problems (Requires Auth).
- `POST /`: Create a new problem (Admin/Requires Auth).
- `GET /random`: Get a random problem to solve (Requires Auth).
- `GET /:id`: Retrieve a specific problem by its ID (Requires Auth).
- `PUT /:id`: Update a specific problem (Admin/Requires Auth).
- `DELETE /:id`: Delete a specific problem (Admin/Requires Auth).
- `GET /n/:number`: Retrieve a problem by its problem number (Requires Auth).
- `POST /:id/like`: Like a problem (Requires Auth).
- `POST /:id/dislike`: Dislike a problem (Requires Auth).

## 👤 Users (`/api/users`)
*All user routes require authentication.*
- `GET /`: Retrieve all users (Admin).
- `GET /:id`: Retrieve a specific user by ID.
- `PUT /:id`: Update a specific user by ID.
- `DELETE /:id`: Delete a specific user by ID.

## 🚀 Submissions (`/api/submissions`)
*All submission routes require authentication.*
- `POST /`: Create a new submission (submit code against hidden tests).
- `POST /run`: Run code against sample or custom test cases (without final submission).
- `GET /me`: Retrieve all submissions of the currently authenticated user.
- `GET /problem/:problemId`: Retrieve all submissions for a specific problem.

## 🛑 Error Handling
The API returns standardized JSON error responses in the following format:
```json
{
  "message": "Error description here."
}
```
Common HTTP status codes used:
- `200 OK`: Request successful.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Invalid input or malformed request.
- `401 Unauthorized`: Authentication required or failed.
- `403 Forbidden`: Authenticated but lacks required permissions.
- `404 Not Found`: The requested resource does not exist.
- `500 Internal Server Error`: An unexpected server error occurred.
