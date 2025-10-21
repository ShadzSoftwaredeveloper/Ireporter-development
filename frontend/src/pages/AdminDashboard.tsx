import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
import { IncidentStatus, Incident } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, CheckCircle, Clock, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { incidents, updateIncident } = useData();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [newStatus, setNewStatus] = useState<IncidentStatus>('under-investigation');
  const [adminComment, setAdminComment] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <Alert variant="destructive">
        <AlertDescription>Access denied. Admin privileges required.</AlertDescription>
      </Alert>
    );
  }

  const stats = useMemo(() => {
    const total = incidents.length;
    const resolved = incidents.filter(i => i.status === 'resolved').length;
    const underInvestigation = incidents.filter(i => i.status === 'under-investigation').length;
    const rejected = incidents.filter(i => i.status === 'rejected').length;
    const draft = incidents.filter(i => i.status === 'draft').length;
    const redFlags = incidents.filter(i => i.type === 'red-flag').length;
    const interventions = incidents.filter(i => i.type === 'intervention').length;

    return {
      total,
      resolved,
      underInvestigation,
      rejected,
      draft,
      redFlags,
      interventions,
    };
  }, [incidents]);

  const chartData = [
    { name: 'Red-flags', value: stats.redFlags },
    { name: 'Interventions', value: stats.interventions },
  ];

  const statusData = [
    { name: 'Resolved', count: stats.resolved },
    { name: 'Under Investigation', count: stats.underInvestigation },
    { name: 'Rejected', count: stats.rejected },
    { name: 'Draft', count: stats.draft },
  ];

  const COLORS = ['#ef4444', '#f97316'];
  const STATUS_COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#6b7280'];

  const pendingIncidents = useMemo(() => {
    return incidents
      .filter(i => i.status === 'under-investigation' || i.status === 'draft')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [incidents]);

  const handleUpdateStatus = () => {
    if (selectedIncident) {
      updateIncident(selectedIncident.id, {
        status: newStatus,
        adminComment: adminComment.trim() || undefined,
      });
      setSelectedIncident(null);
      setAdminComment('');
    }
  };

  const openIncidentDialog = (incident: Incident) => {
    setSelectedIncident(incident);
    setNewStatus(incident.status);
    setAdminComment(incident.adminComment || '');
  };

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
        <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage all incident reports</p>
      </div>

      {/* Key Metrics */}
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
                <p className="text-sm text-blue-600 mb-1">Under Investigation</p>
                <p className="text-blue-900">{stats.underInvestigation}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidents by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Incidents */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pending Incidents</CardTitle>
            <Badge variant="outline" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {pendingIncidents.length} pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {pendingIncidents.length > 0 ? (
            <div className="space-y-3">
              {pendingIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
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
                          incident.status === 'draft'
                            ? 'border-gray-300 text-gray-700'
                            : 'border-blue-300 text-blue-700'
                        }
                      >
                        {incident.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Badge>
                    </div>
                    <Link to={`/incidents/${incident.id}`}>
                      <p className="text-gray-900 hover:text-red-600 transition-colors">
                        {incident.title}
                      </p>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {formatDate(incident.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openIncidentDialog(incident)}
                  >
                    Update Status
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No pending incidents</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Incident Status</DialogTitle>
            <DialogDescription>
              Change the status and add admin comments for this incident
            </DialogDescription>
          </DialogHeader>
          
          {selectedIncident && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Incident</p>
                <p className="text-gray-900">{selectedIncident.title}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-900">New Status</p>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as IncidentStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="under-investigation">Under Investigation</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-900">Admin Comment</p>
                <Textarea
                  placeholder="Add a comment explaining the status change..."
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedIncident(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
