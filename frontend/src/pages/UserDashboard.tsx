import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FileText, CheckCircle, Clock, XCircle, Bell, Eye, Plus, AlertTriangle } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { incidents } = useData();
  const { notifications, markAsRead } = useNotifications();

  const userIncidents = useMemo(() => {
    return incidents.filter(i => i.userId === user?.id);
  }, [incidents, user]);

  const stats = useMemo(() => {
    const total = userIncidents.length;
    const draft = userIncidents.filter(i => i.status === 'draft').length;
    const underInvestigation = userIncidents.filter(i => i.status === 'under-investigation').length;
    const resolved = userIncidents.filter(i => i.status === 'resolved').length;
    const rejected = userIncidents.filter(i => i.status === 'rejected').length;

    return {
      total,
      draft,
      underInvestigation,
      resolved,
      rejected,
    };
  }, [userIncidents]);

  const recentIncidents = useMemo(() => {
    return userIncidents
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [userIncidents]);

  const userNotifications = useMemo(() => {
    return notifications.filter(n => n.userId === user?.id);
  }, [notifications, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                <p className="text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Under Investigation</p>
                <p className="text-blue-900">{stats.underInvestigation}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Resolved</p>
                <p className="text-green-900">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Drafts</p>
                <p className="text-gray-900">{stats.draft}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications Widget */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <CardTitle>Recent Notifications</CardTitle>
              </div>
              <Link to="/notifications">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {userNotifications.length > 0 ? (
              <div className="space-y-3">
                {userNotifications
                  .slice(0, 5)
                  .map((notification) => (
                    <Link
                      key={notification.id}
                      to={`/incidents/${notification.incidentId}`}
                      className="block"
                    >
                      <div
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          notification.read
                            ? 'bg-white border-gray-200'
                            : 'bg-blue-50 border-blue-300'
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant={notification.type === 'status-update' ? 'default' : 'outline'}
                                className={
                                  notification.type === 'status-update'
                                    ? 'bg-blue-600'
                                    : ''
                                }
                              >
                                {notification.type === 'status-update' ? '📊 Status Update' : '🔔 Notification'}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-gray-900 mb-1">{notification.message}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <Eye className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No notifications yet</p>
                <p className="text-xs mt-1">You'll see status updates here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Incidents</CardTitle>
              <Link to="/incidents">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentIncidents.length > 0 ? (
              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <Link
                    key={incident.id}
                    to={`/incidents/${incident.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={
                          incident.type === 'red-flag'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-orange-800'
                        }
                      >
                        {incident.type === 'red-flag' ? 'Red-flag' : 'Intervention'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          incident.status === 'draft'
                            ? 'border-gray-300 text-gray-700'
                            : incident.status === 'under-investigation'
                            ? 'border-blue-300 text-blue-700'
                            : incident.status === 'resolved'
                            ? 'border-green-300 text-green-700'
                            : 'border-red-300 text-red-700'
                        }
                      >
                        {incident.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-900 mb-1 line-clamp-1">{incident.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(incident.createdAt)}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No incidents yet</p>
                <p className="text-xs mt-1">Create your first incident report</p>
                <Link to="/create">
                  <Button className="mt-4" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Incident
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/create">
              <Button className="w-full" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create New Incident
              </Button>
            </Link>
            <Link to="/incidents">
              <Button variant="outline" className="w-full" size="lg">
                <FileText className="w-5 h-5 mr-2" />
                View All Incidents
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="outline" className="w-full" size="lg">
                <Bell className="w-5 h-5 mr-2" />
                View Notifications
                {userNotifications.filter(n => !n.read).length > 0 && (
                  <Badge className="ml-2">{userNotifications.filter(n => !n.read).length}</Badge>
                )}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
