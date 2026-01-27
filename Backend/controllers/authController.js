const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database/connection');

// Generate JWT token including the REAL database ID
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Fetch user from database (Both Admin and Users)
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // 2. Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Optional: Master password fallback for environment admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@scholarship.com';
    const adminPassword = process.env.ADMIN_PASSWORD ;
    const isMasterAdmin = (email === adminEmail && password === adminPassword);

    if (!isPasswordValid && !isMasterAdmin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Generate token with the actual ID from the DB
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@scholarship.com';
    if (email === adminEmail) {
      return res.status(400).json({ error: 'This email is reserved for admin use' });
    }

    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    const [users] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Get current user session
const getCurrentUser = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login, getCurrentUser };