import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/api';

export const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    cgpa: '',
    family_income: '',
    category: 'GEN',
    highest_education: '',
    interests: '',
    state: '',
    gender: '',
    date_of_birth: '',
  });

  // Updated to match your latest MySQL ENUM values exactly
  const categories = ['GEN', 'OBC', 'SC', 'ST', 'Minority'];
  const educationLevels = ['10th', '12th', 'Undergraduate', 'Graduate', 'Post-Graduate'];
  const genders = ['Male', 'Female', 'Other'];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await profileAPI.get();
        if (response.profile) {
          setFormData({
            cgpa: response.profile.cgpa || '',
            family_income: response.profile.family_income || '',
            category: response.profile.category || 'GEN',
            highest_education: response.profile.highest_education || '',
            interests: response.profile.interests || '',
            state: response.profile.state || '',
            gender: response.profile.gender || '',
            date_of_birth: response.profile.date_of_birth ? response.profile.date_of_birth.split('T')[0] : '',
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await profileAPI.update(formData);
      alert('Profile saved successfully! Your matches are being updated.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please check if all required fields are filled.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-form-page">
      <div className="profile-form-card">
        <div className="form-header">
          <h1>Complete Your Profile</h1>
          <p className="form-subtitle">Help us find the perfect scholarships for you</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-section">
            <h2>Academic Information</h2>

            <div className="form-group">
              <label htmlFor="cgpa">CGPA / Percentage *</label>
              <input
                type="number"
                id="cgpa"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleInputChange}
                placeholder="Enter your CGPA (e.g., 8.5)"
                step="0.01"
                min="0"
                max="10"
                required
              />
              <span className="form-hint">Enter CGPA on a scale of 10</span>
            </div>

            <div className="form-group">
              <label htmlFor="highest_education">Current Education Level *</label>
              <select
                id="highest_education"
                name="highest_education"
                value={formData.highest_education}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Education Level</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Personal Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  {genders.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date_of_birth">Date of Birth *</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Financial Information</h2>

            <div className="form-group">
              <label htmlFor="family_income">Annual Family Income (₹) *</label>
              <input
                type="number"
                id="family_income"
                name="family_income"
                value={formData.family_income}
                onChange={handleInputChange}
                placeholder="Enter annual family income"
                min="0"
                required
              />
              <span className="form-hint">Enter your family's total annual income in rupees</span>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>

            <div className="form-group">
              <label htmlFor="interests">Interests & Field of Study</label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="e.g., Computer Science, Medical, Engineering"
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};