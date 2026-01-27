const { pool } = require('../database/connection');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [profiles] = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    if (profiles.length === 0) {
      return res.json({ profile: null });
    }

    res.json({ profile: profiles[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create or update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      cgpa,
      family_income,
      category,
      highest_education,
      state,
      interests,
      gender,
      date_of_birth,
    } = req.body;

    // Check if profile exists
    const [existingProfiles] = await pool.query(
      'SELECT id FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    if (existingProfiles.length > 0) {
      // Update existing profile
      await pool.query(
        `UPDATE user_profiles 
         SET cgpa = ?, family_income = ?, category = ?, highest_education = ?, 
             state = ?, interests = ?, gender = ?, date_of_birth = ?
         WHERE user_id = ?`,
        [cgpa, family_income, category, highest_education, state, interests, gender, date_of_birth, userId]
      );
    } else {
      // Create new profile
      await pool.query(
        `INSERT INTO user_profiles 
         (user_id, cgpa, family_income, category, highest_education, state, interests, gender, date_of_birth)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, cgpa, family_income, category, highest_education, state, interests, gender, date_of_birth]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile };

