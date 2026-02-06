import React, { useState } from 'react';
import { useScholarships } from '../context/ScholarshipContext';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

export const AdminDashboard: React.FC = () => {
  const { scholarships, addScholarship, deleteScholarship, updateScholarship } = useScholarships();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [showForm, setShowForm] = useState(false);
  
  const [editData, setEditData] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    amount: '',
    eligibility: '',
    requiredDocuments: '', 
    officialWebsite: '',
    annualIncome: '', 
    category: 'GEN',
    educationLevel: 'Undergraduate', 
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (scholarship: any) => {
    setEditData(scholarship);
    setFormData({
      name: scholarship.name,
      description: scholarship.description,
      deadline: scholarship.deadline.split('T')[0], 
      amount: scholarship.amount,
      eligibility: Array.isArray(scholarship.eligibility) ? scholarship.eligibility.join('\n') : scholarship.eligibility,
      requiredDocuments: Array.isArray(scholarship.required_documents) ? scholarship.required_documents.join('\n') : scholarship.required_documents,
      officialWebsite: scholarship.official_website || '',
      annualIncome: scholarship.annual_income || '', 
      category: scholarship.category || 'GEN',
      educationLevel: scholarship.education_level || 'Undergraduate', 
    });
    setShowEditModal(true);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || formData.description.trim().length < 20) {
      showError('Description must be at least 20 characters long.', '⚠️');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        deadline: formData.deadline,
        amount: formData.amount,
        eligibility: formData.eligibility.split('\n').filter((item) => item.trim() !== '').join('\n'),
        required_documents: formData.requiredDocuments.split('\n').filter((item) => item.trim() !== '').join('\n'),
        official_website: formData.officialWebsite,
        annual_income: formData.annualIncome ? parseInt(formData.annualIncome) : null, 
        category: formData.category,
        education_level: formData.educationLevel,
      };

      if (showEditModal && editData) {
        await updateScholarship(editData.id, payload);
        showSuccess('Scholarship updated successfully!', '✏️');
      } else {
        await addScholarship(payload);
        showSuccess('Scholarship added successfully!', '🎉');
      }

      setFormData({ name: '', description: '', deadline: '', amount: '', eligibility: '', requiredDocuments: '', officialWebsite: '', annualIncome: '', category: 'GEN', educationLevel: 'Undergraduate' });
      setShowForm(false);
      setShowEditModal(false);
      setEditData(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || error.message || 'Operation failed';
      showError(`Error: ${errorMessage}`, '❌');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteScholarship(id);
        showSuccess('Scholarship deleted successfully!', '🗑️');
      } catch (error) {
        showError('Failed to delete scholarship.', '❌');
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="admin-dashboard">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button 
          className="btn-primary" 
          onClick={() => {
            setShowForm(!showForm);
            setShowEditModal(false);
            if (!showForm) {
                setFormData({ name: '', description: '', deadline: '', amount: '', eligibility: '', requiredDocuments: '', officialWebsite: '', annualIncome: '', category: 'GEN', educationLevel: 'Undergraduate' });
            }
          }}
        >
          {showForm || showEditModal ? 'Cancel' : '+ Add New Scholarship'}
        </button>
      </div>

      {(showForm || showEditModal) && (
        <div className="scholarship-form-card" style={{ border: showEditModal ? '2px solid #4a90e2' : 'none', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: showEditModal ? '#4a90e2' : '#333' }}>
            {showEditModal ? `Edit Scholarship: ${editData?.name}` : 'Add New Scholarship'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Scholarship Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Description * (Min 20 chars)</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} required minLength={20} />
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Amount *</label>
                <input type="text" name="amount" value={formData.amount} onChange={handleInputChange} required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Deadline *</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Max Income (₹)</label>
                <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleInputChange} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="GEN">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Minority">Minority</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Education Level *</label>
                <select name="educationLevel" value={formData.educationLevel} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }}>
                  <option value="10th">10th</option>
                  <option value="12th">12th</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post-Graduate">Post-Graduate</option>
                </select>
              </div>
            </div>

            
            <div className="form-group">
                <label>Eligibility (one per line) *</label>
                <textarea name="eligibility" value={formData.eligibility} onChange={handleInputChange} rows={3} required />
            </div>
            
            <div className="form-group">
                <label>Required Documents (one per line) *</label>
                <textarea name="requiredDocuments" value={formData.requiredDocuments} onChange={handleInputChange} rows={3} required />
            </div>

            <div className="form-group">
              <label>Official Website URL</label>
              <input type="url" name="officialWebsite" value={formData.officialWebsite} onChange={handleInputChange} placeholder="https://example.com" />
            </div>


            <button type="submit" className="btn-primary btn-submit" style={{ backgroundColor: showEditModal ? '#28a745' : '#6366f1', marginTop: '10px' }}>
              {showEditModal ? 'Save Changes' : 'Create Scholarship'}
            </button>
          </form>
        </div>
      )}

      <div className="scholarships-list-section">
        <h2>All Scholarships ({scholarships ? scholarships.length : 0})</h2>
        <div className="admin-scholarships-table">
          {scholarships?.map((scholarship) => (
            <div key={scholarship.id} className="admin-scholarship-card" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee', backgroundColor: '#fff', marginBottom: '10px' }}>
              <div className="scholarship-info">
                <h3>{scholarship.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>
                  <span style={{ fontWeight: 'bold', color: '#2ecc71', marginRight: '15px' }}>{scholarship.amount}</span>
                  <span style={{ marginRight: '15px' }}><strong>Level:</strong> {scholarship.education_level}</span>
                  <span><strong>Deadline:</strong> {formatDate(scholarship.deadline)}</span>
                </div>
              </div>
              <div className="scholarship-actions">
                <button
                  style={{ backgroundColor: '#4a90e2', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px', fontWeight: '600' }}
                  onClick={() => handleEditClick(scholarship)}
                >
                  Edit
                </button>
                <button 
                  style={{ backgroundColor: '#e74c3c', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                  onClick={() => handleDelete(scholarship.id, scholarship.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};