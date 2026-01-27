# 🎓 Scholarship Recommendation Platform

A full-stack web application that helps students find and apply for scholarships based on their academic profile, financial status, and personal information using an AI-powered recommendation system.

## ✨ Features

### For Students (Users)
- 🔐 **Secure Authentication** - Register and login with JWT-based authentication
- 📊 **Personalized Dashboard** - View profile completion, statistics, and top recommendations
- 🎯 **AI-Powered Matching** - Get scholarship recommendations based on your profile (CGPA, income, category, gender, etc.)
- 👤 **Profile Management** - Create and update your academic and personal profile
- 🔍 **Browse Scholarships** - View all available scholarships with match percentages
- 📝 **Detailed Information** - View complete scholarship details, eligibility, and required documents

### For Admin
- ➕ **Add Scholarships** - Create new scholarship opportunities
- ✏️ **Manage Scholarships** - Update or delete existing scholarships
- 📋 **View All Scholarships** - See all active scholarships in the system
- 🔄 **Real-time Updates** - Changes reflect immediately for all users

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Context API** for state management
- **Vite** for fast development and building
- **Modern CSS** with gradient designs and animations

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Scholarship
```

### 2. Database Setup

1. **Start MySQL Server**
   - Make sure MySQL is running on your machine

2. **Create Database and Tables**
   ```bash
   mysql -u root -p < Backend/database/schema.sql
   ```
   
   Or manually:
   - Open MySQL Workbench or command line
   - Run the SQL script located at `Backend/database/schema.sql`

3. **Verify Database**
   ```sql
   USE scholarship_db;
   SHOW TABLES;
   ```
   You should see: `users`, `user_profiles`, `scholarships`, `user_bookmarks`

### 3. Backend Setup

1. **Navigate to Backend folder**
   ```bash
   cd Backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   
   - Edit `.env` file with your MySQL credentials:
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=scholarship_db
     DB_PORT=3306
     JWT_SECRET=your_super_secret_key_change_this
     JWT_EXPIRE=7d
     ```

4. **Start Backend Server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

   ✅ Backend should be running on `http://localhost:5000`

### 4. Frontend Setup

1. **Open a new terminal and navigate to Frontend folder**
   ```bash
   cd Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   ✅ Frontend should be running on `http://localhost:3000`

## 🔑 Default Admin Credentials

- **Email:** admin@scholarship.com
- **Password:** admin123

## 📱 Usage

### For Students

1. **Register an Account**
   - Go to `http://localhost:3000/register`
   - Fill in your details (name, email, password)
   - Click "Register"

2. **Complete Your Profile**
   - After registration, go to Profile page
   - Fill in academic details (CGPA, education level)
   - Add personal information (gender, DOB, category, state)
   - Add financial information (family income)
   - Click "Save Profile"

3. **Browse Scholarships**
   - Go to Dashboard to see top recommendations
   - Click "Scholarships" to see all available options
   - Each scholarship shows a match percentage based on your profile
   - Sort by Best Match or Deadline

4. **View Scholarship Details**
   - Click on any scholarship card
   - View complete details, eligibility criteria, required documents
   - Click "Apply Now" to visit the official website

### For Admin

1. **Login with Admin Credentials**
   - Email: `admin@scholarship.com`
   - Password: `admin123`

2. **Add New Scholarship**
   - After login, you'll be redirected to Admin Dashboard
   - Click "+ Add New Scholarship"
   - Fill in all required fields:
     - Name, Description, Amount
     - Deadline date
     - Eligibility criteria (one per line)
     - Required documents (one per line)
     - Official website URL
   - Click "Add Scholarship"

3. **Manage Scholarships**
   - View all scholarships in the list below
   - Click "Delete" to remove a scholarship

4. **View Scholarships as User**
   - Click "View Scholarships" in navigation
   - See how scholarships appear to students

## 🎯 Recommendation Algorithm

The system calculates match percentage (70-100%) based on:

### Base Score: 70%

### Additional Points:
- **CGPA Match** (+5 to +10 points)
  - 8.0+ required: +10 points
  - 7.5+ required: +8 points
  - 7.0+ required: +6 points
  - 6.5+ required: +5 points

- **Income Match** (+6 to +10 points)
  - Family income < 3 lakhs: +10 points
  - Family income < 5 lakhs: +8 points
  - Family income < 8 lakhs: +6 points

- **Gender Match** (+10 points)
  - Female students for women-specific scholarships

- **Category Match** (+5 points)
  - Matching category (SC/ST/OBC/Minority)

## 📁 Project Structure

```
Scholarship/
├── Backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── scholarshipController.js
│   │   └── profileController.js
│   ├── database/
│   │   ├── connection.js
│   │   └── schema.sql
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── scholarshipRoutes.js
│   │   └── profileRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── README.md
│   └── server.js
│
└── Frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.tsx
    │   ├── context/
    │   │   ├── AuthContext.tsx
    │   │   └── ScholarshipContext.tsx
    │   ├── pages/
    │   │   ├── AdminDashboard.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── Login.tsx
    │   │   ├── ProfileForm.tsx
    │   │   ├── Register.tsx
    │   │   ├── ScholarshipDetails.tsx
    │   │   └── Scholarships.tsx
    │   ├── routes/
    │   │   └── PrivateRoute.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

## 🔧 API Endpoints

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

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check DB credentials in `.env` file
- Ensure database `scholarship_db` exists
- Verify tables are created

### Backend Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

### Frontend Not Connecting to Backend
- Ensure backend is running on port 5000
- Check `API_BASE_URL` in `Frontend/src/services/api.ts`
- Verify CORS is enabled in backend

### CORS Errors
- Backend already has CORS configured
- If issues persist, check browser console for specific error

## 🎨 Design Features

- **Modern Gradient UI** with purple/blue theme
- **Smooth Animations** on page load and interactions
- **Responsive Design** works on all screen sizes
- **Card-based Layouts** for better visual hierarchy
- **Color-coded Match Badges** (green for high match, orange for medium)
- **Urgency Indicators** for approaching deadlines

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** using bcryptjs
- **Input Validation** on all forms
- **SQL Injection Protection** using parameterized queries
- **XSS Protection** through React's built-in escaping
- **CORS Protection** configured properly

## 📊 Database Schema

### users
- id, name, email, password, role, created_at, updated_at

### user_profiles
- id, user_id, cgpa, family_income, category, highest_education, state, interests, gender, date_of_birth

### scholarships
- id, name, description, amount, deadline, eligibility, required_documents, official_website, created_by, is_active

### user_bookmarks
- id, user_id, scholarship_id, bookmarked_at

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Support

For issues and questions:
- Open an issue on GitHub
- Contact the development team

## 🚀 Future Enhancements

- Email notifications for deadlines
- Application tracking system
- Document upload functionality
- Advanced filters and search
- Mobile app version
- Multi-language support
- Export scholarship list to PDF
- Bookmark favorite scholarships

---

**Made with ❤️ for students seeking educational opportunities**

