const { pool } = require('../database/connection');

/**
 * Enhanced Logic: 
 * Returns { score: number, reasons: string[] }
 * 1. Education Level: 40% (Strict Filter)
 * 2. CGPA: 20%
 * 3. Annual Income: 20%
 * 4. Category: 20%
 */
const calculateMatch = (scholarship, userProfile) => {
  if (!userProfile) return { score: 0, reasons: ["Profile not completed."] };
  
  let matchScore = 0;
  const reasons = [];

  // 1. Education Level (Strict Check)
  // We use strict equality here as the SQL filter already handled the heavy lifting.
  if (userProfile.highest_education !== scholarship.education_level) {
    return { score: 0, reasons: [`Education level mismatch (Requires ${scholarship.education_level})`] };
  }
  matchScore += 40; 

  // 2. CGPA (Weight: 20%)
  if (userProfile.cgpa >= 7.5) {
    matchScore += 20;
  } else if (userProfile.cgpa >= 6.0) {
    matchScore += 10;
    reasons.push("CGPA is below 7.5 (Partial match points awarded)");
  } else {
    reasons.push("CGPA is below 6.0 (No academic match points awarded)");
  }

  // 3. Income (Weight: 20%)
  if (userProfile.family_income && scholarship.annual_income) {
    if (userProfile.family_income <= scholarship.annual_income) {
      matchScore += 20;
    } else {
      reasons.push(`Family income exceeds ₹${scholarship.annual_income} limit`);
    }
  }

  // 4. Category (Weight: 20%)
  if (userProfile.category && scholarship.category) {
    if (userProfile.category === scholarship.category || scholarship.category === 'GEN') {
      matchScore += 20;
    } else {
      reasons.push(`Scholarship is reserved for ${scholarship.category} category`);
    }
  }

  return { 
    score: Math.min(matchScore, 100), 
    reasons: reasons 
  };
};

// GET ALL: Branching logic for Admin vs User
const getAllScholarships = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const [profiles] = await pool.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    const userProfile = profiles[0] || null;

    if (userRole === 'admin') {
      const [allScholarships] = await pool.query(
        'SELECT * FROM scholarships WHERE is_active = TRUE ORDER BY created_at DESC'
      );

      const formattedAdminData = allScholarships.map(s => ({
        ...s,
        eligibility: s.eligibility ? s.eligibility.split('\n') : [],
        requiredDocuments: s.required_documents ? s.required_documents.split('\n') : [],
        matchPercentage: 100 
      }));

      return res.json({ scholarships: formattedAdminData });

    } else {
      if (!userProfile) {
        return res.status(400).json({ error: 'Please complete your profile first' });
      }

      const [filteredScholarships] = await pool.query(
        `SELECT * FROM scholarships 
         WHERE is_active = TRUE 
         AND UPPER(TRIM(education_level)) = UPPER(TRIM(?)) 
         ORDER BY deadline ASC`,
        [userProfile.highest_education]
      );

      const matchedData = filteredScholarships.map(scholarship => {
        const matchResult = calculateMatch(scholarship, userProfile);
        return {
          ...scholarship,
          matchPercentage: matchResult.score,
          failedCriteria: matchResult.reasons, // Passed to frontend
          eligibility: scholarship.eligibility ? scholarship.eligibility.split('\n') : [],
          requiredDocuments: scholarship.required_documents ? scholarship.required_documents.split('\n') : [],
        };
      });

      return res.json({ scholarships: matchedData });
    }
  } catch (error) {
    console.error('Get scholarships error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET SINGLE
const getScholarshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [rows] = await pool.query('SELECT * FROM scholarships WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const scholarship = rows[0];

    const [profiles] = await pool.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    const userProfile = profiles[0] || null;

    const matchResult = calculateMatch(scholarship, userProfile);

    const dataWithMatch = {
      ...scholarship,
      matchPercentage: matchResult.score,
      failedCriteria: matchResult.reasons, // Feedback on missed criteria
      eligibility: scholarship.eligibility ? scholarship.eligibility.split('\n') : [],
      requiredDocuments: scholarship.required_documents ? scholarship.required_documents.split('\n') : []
    };

    res.json({ scholarship: dataWithMatch });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// CREATE
const createScholarship = async (req, res) => {
  try {
    const { name, description, amount, deadline, eligibility, required_documents, official_website, annual_income, category, education_level } = req.body;
    const createdBy = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO scholarships (name, description, amount, deadline, eligibility, required_documents, official_website, annual_income, category, education_level, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, amount, deadline, eligibility, required_documents, official_website, annual_income, category, education_level, createdBy]
    );
    res.status(201).json({ message: 'Created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
const updateScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, amount, deadline, eligibility, required_documents, official_website, annual_income, category, education_level } = req.body;

    await pool.query(
      `UPDATE scholarships SET name=?, description=?, amount=?, deadline=?, eligibility=?, required_documents=?, official_website=?, annual_income=?, category=?, education_level=? WHERE id=?`,
      [name, description, amount, deadline, eligibility, required_documents, official_website, annual_income, category, education_level, id]
    );
    res.json({ message: 'Updated' });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// DELETE
const deleteScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE scholarships SET is_active = FALSE WHERE id = ?', [id]);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

module.exports = {
  getAllScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship
};