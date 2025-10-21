import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { User, Mail, Calendar, FileText, CheckCircle, Clock, XCircle, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { getUserIncidents } = useData();

  const userIncidents = useMemo(() => {
    return user ? getUserIncidents(user.id) : [];
  }, [user, getUserIncidents]);

  const stats = useMemo(() => {
    const resolved = userIncidents.filter(i => i.status === 'resolved').length;
    const unresolved = userIncidents.filter(i => 
      i.status === 'draft' || i.status === 'under-investigation'
    ).length;
    const rejected = userIncidents.filter(i => i.status === 'rejected').length;
    const total = userIncidents.length;

    return { resolved, unresolved, rejected, total };
  }, [userIncidents]);

  const recentIncidents = useMemo(() => {
    return [...userIncidents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [userIncidents]);

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Please sign in to view your profile</AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">User Profile</h1>
        <p className="text-gray-600">Manage your account and view your incident reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900">{user.name}</p>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Total Reports</p>
                    <p className="text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2 mt-4">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics */}
          <div>
            <h2 className="text-gray-900 mb-4">Report Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 mb-1">Unresolved</p>
                      <p className="text-blue-900">{stats.unresolved}</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Draft or Under Investigation</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 mb-1">Rejected</p>
                      <p className="text-red-900">{stats.rejected}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gray-900">Recent Reports</h2>
              <Link to="/incidents">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            
            <Card>
              <CardContent className="p-0">
                {recentIncidents.length > 0 ? (
                  <div className="divide-y">
                    {recentIncidents.map((incident) => (
                      <Link
                        key={incident.id}
                        to={`/incidents/${incident.id}`}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
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
                                  incident.status === 'resolved'
                                    ? 'border-green-300 text-green-700'
                                    : incident.status === 'rejected'
                                    ? 'border-red-300 text-red-700'
                                    : 'border-blue-300 text-blue-700'
                                }
                              >
                                {incident.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </Badge>
                            </div>
                            <p className="text-gray-900 truncate">{incident.title}</p>
                            <p className="text-sm text-gray-500">{formatDate(incident.createdAt)}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No incidents reported yet</p>
                    <Link to="/create">
                      <Button className="mt-4">Create Your First Report</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
