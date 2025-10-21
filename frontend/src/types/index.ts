export type IncidentType = 'red-flag' | 'intervention';

export type IncidentStatus = 'draft' | 'under-investigation' | 'resolved' | 'rejected';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  location: Location;
  media: MediaFile[];
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  adminComment?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

export interface DataContextType {
  incidents: Incident[];
  createIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  getIncidentById: (id: string) => Incident | undefined;
  getUserIncidents: (userId: string) => Incident[];
}
