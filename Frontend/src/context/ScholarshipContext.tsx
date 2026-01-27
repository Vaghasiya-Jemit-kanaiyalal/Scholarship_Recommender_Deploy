import React, { createContext, useContext, useState, useEffect } from 'react';
import { scholarshipAPI } from '../services/api';

export interface Scholarship {
  id: number;
  name: string;
  description: string;
  deadline: string;
  amount: string;
  eligibility: string[];
  requiredDocuments: string[];
  official_website?: string;
  matchPercentage?: number;
}

interface ScholarshipContextType {
  scholarships: Scholarship[];
  loading: boolean;
  addScholarship: (scholarship: any) => Promise<void>;
  deleteScholarship: (id: number) => Promise<void>;
  updateScholarship: (id: number, scholarship: any) => Promise<void>;
  refreshScholarships: () => Promise<void>;
}

const ScholarshipContext = createContext<ScholarshipContextType | undefined>(undefined);

export const ScholarshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshScholarships = async () => {
    try {
      setLoading(true);
      const response = await scholarshipAPI.getAll();
      setScholarships(response.scholarships || []);
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load scholarships from backend on mount
    const token = localStorage.getItem('token');
    if (token) {
      refreshScholarships();
    }
  }, []);

  const addScholarship = async (scholarshipData: any) => {
    try {
      await scholarshipAPI.create(scholarshipData);
      await refreshScholarships();
    } catch (error) {
      console.error('Failed to add scholarship:', error);
      throw error;
    }
  };

  const deleteScholarship = async (id: number) => {
    try {
      await scholarshipAPI.delete(id);
      await refreshScholarships();
    } catch (error) {
      console.error('Failed to delete scholarship:', error);
      throw error;
    }
  };

  const updateScholarship = async (id: number, scholarshipData: any) => {
    try {
      await scholarshipAPI.update(id, scholarshipData);
      await refreshScholarships();
    } catch (error) {
      console.error('Failed to update scholarship:', error);
      throw error;
    }
  };

  return (
    <ScholarshipContext.Provider
      value={{
        scholarships,
        loading,
        addScholarship,
        deleteScholarship,
        updateScholarship,
        refreshScholarships,
      }}
    >
      {children}
    </ScholarshipContext.Provider>
  );
};

export const useScholarships = () => {
  const context = useContext(ScholarshipContext);
  if (context === undefined) {
    throw new Error('useScholarships must be used within a ScholarshipProvider');
  }
  return context;
};

