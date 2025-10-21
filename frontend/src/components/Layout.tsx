import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { AlertCircle, FileText, User, LayoutDashboard, LogOut, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  const navigation = [
    { name: 'Create Incident', path: '/create', icon: Plus },
    { name: 'View Incidents', path: '/incidents', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className="text-gray-900">iReporter</span>
            </Link>

            {user && (
              <nav className="flex items-center gap-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-red-50 text-red-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-gray-600 text-sm">{user.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
