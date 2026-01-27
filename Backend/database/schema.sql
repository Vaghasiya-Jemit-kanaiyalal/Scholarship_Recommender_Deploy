-- Create Database
CREATE DATABASE IF NOT EXISTS scholarship_db;
USE scholarship_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    cgpa DECIMAL(3,2),
    family_income INT,
    category ENUM('GEN', 'OBC', 'SC', 'ST', 'Minority') DEFAULT 'GEN',
    highest_education VARCHAR(100),
    state VARCHAR(100),
    interests TEXT,
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Scholarships Table
CREATE TABLE IF NOT EXISTS scholarships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    amount VARCHAR(50) NOT NULL,
    deadline DATE NOT NULL,
    eligibility TEXT NOT NULL,
    required_documents TEXT NOT NULL,
    official_website VARCHAR(500),
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- User Scholarship Applications Table (for tracking which scholarships users have viewed/bookmarked)
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    scholarship_id INT NOT NULL,
    bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE,
    UNIQUE KEY unique_bookmark (user_id, scholarship_id)
);

-- Insert Default Admin User (password: admin123 - hashed with bcrypt)
-- Password hash for "admin123"
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@scholarship.com', '$2a$10$xP5K8qVXZ1YqZ5X.Y5N8.OZJzG5vX8YLjZHgZfZ1yHgZfZ1yHgZfZ', 'admin')
ON DUPLICATE KEY UPDATE email=email;

-- Sample Scholarships
INSERT INTO scholarships (name, description, amount, deadline, eligibility, required_documents, official_website, created_by) VALUES
('Merit Excellence Scholarship', 'For students with excellent academic records. This scholarship recognizes and rewards outstanding academic performance.', '₹50,000', '2026-06-30', 'CGPA 8.0 or above\nCurrently enrolled in recognized institution\nCitizen of India', 'Academic transcript\nIdentity proof\nProof of enrollment\nBank account details', 'https://scholarships.example.com/merit', 1),
('Rural Development Fund', 'Supporting education in rural areas to bridge the gap in educational opportunities.', '₹40,000', '2026-07-15', 'From rural area (population < 10,000)\nCGPA 6.5 or above\nAnnual family income < 5 lakhs', 'Rural area certificate\nIncome certificate\nAcademic transcript\nAddress proof', 'https://scholarships.example.com/rural', 1),
('Women Empowerment Scholarship', 'Empowering women through education. Dedicated to supporting female students.', '₹60,000', '2026-05-20', 'Female student\nCGPA 7.0 or above\nAnnual family income < 8 lakhs', 'Gender verification document\nIncome certificate\nAcademic transcript\nIdentity proof', 'https://scholarships.example.com/women', 1);

