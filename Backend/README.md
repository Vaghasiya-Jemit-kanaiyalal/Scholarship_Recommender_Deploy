# Scholarship Platform Backend

Backend API for the Scholarship Platform built with Node.js, Express, and MySQL.

## Features

- ✅ User Authentication (JWT-based)
- ✅ Role-based Access Control (Admin/User)
- ✅ Scholarship CRUD Operations
- ✅ User Profile Management
- ✅ AI-based Scholarship Recommendation System
- ✅ Data Validation
- ✅ Secure Password Hashing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup MySQL Database**
   - Make sure MySQL is running
   - Create a new database or use the provided schema:
     ```bash
     mysql -u root -p < database/schema.sql
     ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your MySQL credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=scholarship_db
     ```

4. **Run the Server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

5. **Server should be running on:** `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Scholarships
- `GET /api/scholarships` - Get all scholarships with match % (Protected)
- `GET /api/scholarships/:id` - Get single scholarship (Protected)
- `POST /api/scholarships` - Create scholarship (Admin only)
- `PUT /api/scholarships/:id` - Update scholarship (Admin only)
- `DELETE /api/scholarships/:id` - Delete scholarship (Admin only)

### Profile
- `GET /api/profile` - Get user profile (Protected)
- `PUT /api/profile` - Update user profile (Protected)

## Default Admin Credentials

- **Email:** admin@scholarship.com
- **Password:** admin123

## Database Schema

### Tables:
1. **users** - User authentication and role management
2. **user_profiles** - User academic and personal details
3. **scholarships** - Scholarship information
4. **user_bookmarks** - Track user bookmarked scholarships

## Recommendation Algorithm

The system calculates match percentage based on:
- CGPA requirements
- Family income eligibility
- Gender criteria
- Category (GEN/OBC/SC/ST/Minority)
- Education level
- State/location preferences

Match scores range from 70-100%, with higher matches showing better compatibility.

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

