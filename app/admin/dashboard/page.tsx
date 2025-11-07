'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAuth, type AdminUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Eye,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface ApplicationSummary {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name?: string;
  travel_method: string;
  travel_type: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
  current_step?: string;
  completed: boolean;
  form_data: Record<string, unknown>;
  admin_notes?: string;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inReview: 0,
    completed: 0
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const currentAdmin = await adminAuth.getCurrentAdmin();
      if (!currentAdmin) {
        router.push('/admin');
        return;
      }
      
      setAdmin(currentAdmin);
      await loadApplications();
    };

    checkAuthAndLoad();
  }, [router]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('application_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const applications = data || [];
      setApplications(applications);

      // Calculate stats
      const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        inReview: applications.filter(app => app.status === 'in_review').length,
        completed: applications.filter(app => app.completed).length
      };
      setStats(stats);

    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminAuth.logout();
    router.push('/admin');
  };

  const getStatusColor = (status: string, completed: boolean) => {
    if (completed) return 'bg-green-100 text-green-800';
    
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-4 w-4" />;
    
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_review': return <AlertCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.stripe_session_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Philippines eTravel Management</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <strong>{admin.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-gray-600">Total Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.inReview}</p>
                <p className="text-gray-600">In Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email, name, or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={loadApplications}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Applications ({filteredApplications.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Travel Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.customer_name || 'Not provided'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.customer_email}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {application.stripe_session_id.substring(0, 15)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.travel_method}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.travel_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status, application.completed)}`}>
                          {getStatusIcon(application.status, application.completed)}
                          {application.completed ? 'Completed' : application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(application.created_at).toLocaleDateString()}
                        <div className="text-xs text-gray-500">
                          {new Date(application.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.current_step || 'Started'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Object.keys(application.form_data || {}).length} fields
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/admin/applications/${application.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredApplications.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No applications found</p>
                  <p className="text-sm">Applications will appear here as customers submit their forms</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
