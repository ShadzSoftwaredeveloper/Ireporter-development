import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, NotificationContextType } from '../types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import { safeJson } from '../utils/safeJson';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [polling, setPolling] = useState(false);
  const [unreadRemoteCount, setUnreadRemoteCount] = useState<number | null>(null);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await safeJson(response);
          setNotifications(data?.data?.notifications || []);
        } else {
          console.error('Failed to fetch notifications');
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  // Poll for unread count and refresh notifications when new ones arrive
  useEffect(() => {
    if (!user) return;

    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const pollUnread = async () => {
      try {
        const resp = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}/unread-count`, {
          headers: getAuthHeaders(),
        });
        if (!resp.ok) return;
        const data = await safeJson(resp);
        const remoteCount = data?.data?.count ?? 0;

        if (!mounted) return;

        setUnreadRemoteCount(remoteCount);

        const localUnread = notifications.filter((n) => !n.read && n.userId === user.id).length;
        if (remoteCount > localUnread) {
          // fetch full notifications
          const r = await fetch(API_ENDPOINTS.NOTIFICATIONS, { headers: getAuthHeaders() });
          if (r.ok) {
            const d = await safeJson(r);
            if (mounted) setNotifications(d?.data?.notifications || []);
          }
        }
      } catch (err) {
        console.error('Error polling notifications:', err);
      }
    };

    // Start immediate poll and then interval
    pollUnread();
    intervalId = setInterval(pollUnread, 10000);
    if (mounted) setPolling(true);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
      setPolling(false);
    };
  }, [user, notifications]);

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      const response = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(notification),
      });

      const data = await safeJson(response);

      if (!response.ok) {
        throw new Error((data && data.message) || 'Failed to create notification');
      }

      const newNotification = data?.data?.notification;
      setNotifications([newNotification, ...notifications]);

      // Show toast notification
      const notificationType = notification.type === 'new-incident' ? '🆕' : '📊';
      toast.success(`${notificationType} ${notification.message}`);
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.MARK_READ(notificationId), {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const updatedNotifications = notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        );
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.MARK_ALL_READ, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const updatedNotifications = notifications.map((notification) =>
          notification.userId === user.id
            ? { ...notification, read: true }
            : notification
        );
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.NOTIFICATION_BY_ID(notificationId), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const updatedNotifications = notifications.filter(
          (notification) => notification.id !== notificationId
        );
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getUserNotifications = (userId: string) => {
    return notifications
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const unreadCount = user
    ? notifications.filter((n) => n.userId === user.id && !n.read).length
    : 0;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        getUserNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};