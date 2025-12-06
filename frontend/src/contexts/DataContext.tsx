import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident, DataContextType } from '../types';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import { safeJson } from '../utils/safeJson';
import { useAuth } from './AuthContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
  onStatusUpdate?: (incident: Incident, oldStatus: string, newStatus: string) => void;
  onIncidentCreate?: (incident: Incident) => void;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children, onStatusUpdate, onIncidentCreate }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch incidents from backend
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.INCIDENTS, {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await safeJson(response);
          setIncidents(data?.data?.incidents || []);
        } else {
          console.error('Failed to fetch incidents');
          setIncidents([]);
        }
      } catch (error) {
        console.error('Error fetching incidents:', error);
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchIncidents();
    } else {
      setIncidents([]);
      setLoading(false);
    }
  }, [user]);

  const createIncident = async (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const response = await fetch(API_ENDPOINTS.INCIDENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(incident),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error((data && data.message) || 'Failed to create incident');
      }

      const newIncident = data?.data?.incident;
      setIncidents([...incidents, newIncident]);
      
      // Trigger notification for admins
      if (onIncidentCreate) {
        onIncidentCreate(newIncident);
      }
    } catch (error: any) {
      console.error('Error creating incident:', error);
      const msg = error instanceof Error ? error.message : String(error) || 'Failed to create incident';
      throw new Error(msg);
    }
  };

  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    const oldIncident = incidents.find((incident) => incident.id === id);
    const oldStatus = oldIncident?.status;
    
    try {
      const response = await fetch(API_ENDPOINTS.INCIDENT_BY_ID(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updates),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error((data && data.message) || 'Failed to update incident');
      }

      const updatedIncident = data?.data?.incident;
      const updatedIncidents = incidents.map((incident) =>
        incident.id === id ? updatedIncident : incident
      );
      setIncidents(updatedIncidents);
      
      // Trigger notification if admin updated status
      if (user?.role === 'admin' && updates.status && oldStatus !== updates.status && onStatusUpdate) {
        onStatusUpdate(updatedIncident, oldStatus, updates.status);
      }
    } catch (error: any) {
      console.error('Error updating incident:', error);
      const msg = error instanceof Error ? error.message : String(error) || 'Failed to update incident';
      throw new Error(msg);
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.INCIDENT_BY_ID(id), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const data = await safeJson(response);
        throw new Error((data && data.message) || 'Failed to delete incident');
      }

      const updatedIncidents = incidents.filter((incident) => incident.id !== id);
      setIncidents(updatedIncidents);
    } catch (error: any) {
      console.error('Error deleting incident:', error);
      const msg = error instanceof Error ? error.message : String(error) || 'Failed to delete incident';
      throw new Error(msg);
    }
  };

  const getIncidentById = (id: string) => {
    return incidents.find((incident) => incident.id === id);
  };

  const getUserIncidents = (userId: string) => {
    return incidents.filter((incident) => incident.userId === userId);
  };

  return (
    <DataContext.Provider
      value={{
        incidents,
        createIncident,
        updateIncident,
        deleteIncident,
        getIncidentById,
        getUserIncidents,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};