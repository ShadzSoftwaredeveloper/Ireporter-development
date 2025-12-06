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
  profilePicture?: string;
}

export interface Notification {
  id: string;
  userId: string;
  incidentId: string;
  incidentTitle: string;
  type: 'status-update' | 'comment-added' | 'new-incident';
  message: string;
  oldStatus?: IncidentStatus;
  newStatus?: IncidentStatus;
  read: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string, role?: string) => Promise<any>;
  // OTP verify functions removed; authentication is traditional email/password
  signOut: () => void;
  updateProfile: (name: string, email: string, profilePicture?: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
}

export interface DataContextType {
  incidents: Incident[];
  createIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updateIncident: (id: string, updates: Partial<Incident>) => Promise<void>;
  deleteIncident: (id: string) => Promise<void>;
  getIncidentById: (id: string) => Incident | undefined;
  getUserIncidents: (userId: string) => Incident[];
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
}
