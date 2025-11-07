'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAuth, type AdminUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft,
  User,
  Plane,
  Ship,
  Calendar,
  Mail,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  Save,
  Download,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';

interface ApplicationDetails {
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
  assigned_admin_id?: string;
}

export default function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<string>('pending');
  const router = useRouter();

  const loadApplication = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('application_sessions')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (error) throw error;

      setApplication(data);
      setAdminNotes(data.admin_notes || '');
      setStatus(data.status || 'pending');

    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const currentAdmin = await adminAuth.getCurrentAdmin();
      if (!currentAdmin) {
        router.push('/admin');
        return;
      }
      
      setAdmin(currentAdmin);
      await loadApplication();
    };

    checkAuthAndLoad();
  }, [resolvedParams.id, router, loadApplication]);

  const handleUpdateStatus = async () => {
    if (!application || !admin) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('application_sessions')
        .update({
          status,
          admin_notes: adminNotes,
          assigned_admin_id: admin.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (error) throw error;

      // Reload application to show updated data
      await loadApplication();

    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const formatFieldValue = (value: unknown, type?: string): string => {
    if (value === null || value === undefined) return 'Not provided';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (type === 'json' && typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const isImageUrl = (value: string): boolean => {
    if (!value || typeof value !== 'string') return false;
    return value.startsWith('http') && (value.includes('supabase.co') || value.includes('.png') || value.includes('.jpg') || value.includes('.jpeg') || value.includes('.webp'));
  };

  const FormSection: React.FC<{
    title: string;
    fields: { key: string; label: string; type?: string }[];
    formData: Record<string, unknown>;
  }> = ({ title, fields, formData }) => {
    const hasData = fields.some(field => formData[field.key] !== undefined && formData[field.key] !== null && formData[field.key] !== '');
    
    if (!hasData) return null;
    
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => {
            const value = formData[field.key];
            if (value === undefined || value === null || value === '') return null;
            
            return (
              <div key={field.key} className="space-y-1">
                <p className="text-sm font-medium text-gray-700">{field.label}</p>
                {field.type === 'image' ? (
                  <div className="space-y-2">
                    {isImageUrl(String(value)) ? (
                      <div className="relative group">
                        <div className="aspect-video w-full max-w-xs bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={String(value)}
                            alt={field.label}
                            className="w-full h-full object-cover"
                            width={300}
                            height={200}
                          />
                        </div>
                          <a 
                            href={String(value)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mt-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open full size
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <ImageIcon className="h-4 w-4" />
                          {String(value).startsWith('data:') ? 'Base64 Image Data' : formatFieldValue(value, field.type)}
                      </div>
                    )}
                  </div>
                ) : field.type === 'boolean' ? (
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formatFieldValue(value, field.type)}
                  </span>
                ) : (
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {formatFieldValue(value, field.type)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getStatusColor = (status: string, completed: boolean) => {
    if (completed) return 'bg-green-100 text-green-800 border-green-200';
    
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportApplicationData = () => {
    if (!application) return;

    const exportData = {
      application_id: application.id,
      stripe_session_id: application.stripe_session_id,
      customer_info: {
        email: application.customer_email,
        name: application.customer_name
      },
      travel_details: {
        method: application.travel_method,
        type: application.travel_type
      },
      status: application.status,
      completed: application.completed,
      form_data: application.form_data,
      admin_notes: application.admin_notes,
      created_at: application.created_at,
      updated_at: application.updated_at
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `application_${application.customer_email}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading || !admin || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
                <p className="text-gray-600">{application.customer_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportApplicationData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Application Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Customer Name</p>
                      <p className="text-sm text-gray-600">{application.customer_name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{application.customer_email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment ID</p>
                      <p className="text-sm text-gray-600 font-mono">{application.stripe_session_id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {application.travel_method === 'Flight' ? 
                      <Plane className="h-5 w-5 text-gray-400" /> : 
                      <Ship className="h-5 w-5 text-gray-400" />
                    }
                    <div>
                      <p className="text-sm font-medium text-gray-900">Travel Method</p>
                      <p className="text-sm text-gray-600">{application.travel_method}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ArrowLeft className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Travel Type</p>
                      <p className="text-sm text-gray-600 capitalize">{application.travel_type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(application.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Data */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">Form Data</h2>
                <p className="text-sm text-gray-500">Information submitted by the customer in the same order as the form</p>
              </div>
              
              {application.form_data && Object.keys(application.form_data).length > 0 ? (
                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <FormSection 
                    title="👤 Personal Information" 
                    fields={[
                      { key: 'picture', label: 'Profile Picture', type: 'image' },
                      { key: 'passportType', label: 'Passport Type' },
                      { key: 'firstName', label: 'First Name' },
                      { key: 'middleName', label: 'Middle Name' },
                      { key: 'lastName', label: 'Last Name' },
                      { key: 'suffix', label: 'Suffix' },
                      { key: 'sex', label: 'Sex' },
                      { key: 'birthMonth', label: 'Birth Month' },
                      { key: 'birthDay', label: 'Birth Day' },
                      { key: 'birthYear', label: 'Birth Year' },
                      { key: 'mobileCountryCode', label: 'Mobile Country Code' },
                      { key: 'mobileNumber', label: 'Mobile Number' },
                      { key: 'citizenship', label: 'Citizenship' },
                      { key: 'countryOfBirth', label: 'Country of Birth' },
                      { key: 'passportNumber', label: 'Passport Number' },
                      { key: 'passportIssuingAuthority', label: 'Passport Issuing Authority' },
                      { key: 'passportIssueMonth', label: 'Passport Issue Month' },
                      { key: 'passportIssueDay', label: 'Passport Issue Day' },
                      { key: 'passportIssueYear', label: 'Passport Issue Year' },
                      { key: 'expiryMonth', label: 'Passport Expiry Month' },
                      { key: 'expiryDay', label: 'Passport Expiry Day' },
                      { key: 'expiryYear', label: 'Passport Expiry Year' },
                      { key: 'occupation', label: 'Occupation' }
                    ]}
                    formData={application.form_data}
                  />

                  {/* Address Information Section */}
                  <FormSection 
                    title="🏠 Address Information" 
                    fields={[
                      { key: 'permanentCountryOfResidence', label: 'Permanent Country of Residence' },
                      { key: 'residenceCountry', label: 'Current Residence Country' },
                      { key: 'residenceAddress', label: 'Current Address' },
                      { key: 'residenceAddressLine2', label: 'Address Line 2' }
                    ]}
                    formData={application.form_data}
                  />

                  {/* Travel Details Section */}
                  <FormSection 
                    title={application.travel_method === 'Flight' ? '✈️ Flight Information' : '🚢 Voyage Information'} 
                    fields={application.travel_method === 'Flight' ? [
                      { key: 'purposeOfTravel', label: 'Purpose of Travel' },
                      { key: 'travellerType', label: 'Traveller Type' },
                      { key: 'airline', label: 'Airline' },
                      { key: 'flightNumber', label: 'Flight Number' },
                      { key: 'countryOfOrigin', label: 'Country of Origin' },
                      { key: 'airportOfOrigin', label: 'Airport of Origin' },
                      { key: 'departureMonth', label: 'Departure Month' },
                      { key: 'departureDay', label: 'Departure Day' },
                      { key: 'departureYear', label: 'Departure Year' },
                      { key: 'departureDate', label: 'Departure Date' },
                      { key: 'destination', label: 'Destination' },
                      { key: 'airportOfDestination', label: 'Airport of Destination' },
                      { key: 'arrivalMonth', label: 'Arrival Month' },
                      { key: 'arrivalDay', label: 'Arrival Day' },
                      { key: 'arrivalYear', label: 'Arrival Year' }
                    ] : [
                      { key: 'purposeOfTravel', label: 'Purpose of Travel' },
                      { key: 'travellerType', label: 'Traveller Type' },
                      { key: 'vesselName', label: 'Vessel Name' },
                      { key: 'origin', label: 'Origin' },
                      { key: 'seaportOfOrigin', label: 'Seaport of Origin' },
                      { key: 'departureMonth', label: 'Departure Month' },
                      { key: 'departureDay', label: 'Departure Day' },
                      { key: 'departureYear', label: 'Departure Year' },
                      { key: 'departureDate', label: 'Departure Date' },
                      { key: 'destination', label: 'Destination' },
                      { key: 'seaportOfDestination', label: 'Seaport of Destination' },
                      { key: 'arrivalMonth', label: 'Arrival Month' },
                      { key: 'arrivalDay', label: 'Arrival Day' },
                      { key: 'arrivalYear', label: 'Arrival Year' }
                    ]}
                    formData={application.form_data}
                  />

                  {/* Required Documents Section */}
                  <FormSection 
                    title="📎 Required Documents" 
                    fields={[
                      { key: 'customsDeclarationAttachment', label: 'Customs Declaration Form', type: 'image' },
                      { key: 'currencyDeclarationAttachment', label: 'Currency Declaration Form', type: 'image' },
                      { key: 'digitalSignature', label: 'Digital Signature' }
                    ]}
                    formData={application.form_data}
                  />

                  {/* Additional Form Data Section */}
                  {Object.entries(application.form_data)
                    .filter(([key]) => ![
                      // Personal info
                      'picture', 'passportType', 'firstName', 'middleName', 'lastName', 'suffix', 'sex',
                      'birthMonth', 'birthDay', 'birthYear', 'mobileCountryCode', 'mobileNumber',
                      'citizenship', 'countryOfBirth', 'passportNumber', 'passportIssuingAuthority',
                      'passportIssueMonth', 'passportIssueDay', 'passportIssueYear',
                      'expiryMonth', 'expiryDay', 'expiryYear', 'occupation',
                      // Address
                      'permanentCountryOfResidence', 'residenceCountry', 'residenceAddress', 'residenceAddressLine2',
                      // Travel
                      'purposeOfTravel', 'travellerType', 'airline', 'flightNumber', 'countryOfOrigin',
                      'airportOfOrigin', 'departureMonth', 'departureDay', 'departureYear', 'departureDate',
                      'destination', 'airportOfDestination', 'arrivalMonth', 'arrivalDay', 'arrivalYear',
                      'vesselName', 'origin', 'seaportOfOrigin', 'seaportOfDestination',
                      // Documents
                      'customsDeclarationAttachment', 'currencyDeclarationAttachment', 'digitalSignature'
                    ].includes(key))
                    .length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">📋 Additional Form Data</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(application.form_data)
                          .filter(([key]) => ![
                            'picture', 'passportType', 'firstName', 'middleName', 'lastName', 'suffix', 'sex',
                            'birthMonth', 'birthDay', 'birthYear', 'mobileCountryCode', 'mobileNumber',
                            'citizenship', 'countryOfBirth', 'passportNumber', 'passportIssuingAuthority',
                            'passportIssueMonth', 'passportIssueDay', 'passportIssueYear',
                            'expiryMonth', 'expiryDay', 'expiryYear', 'occupation',
                            'permanentCountryOfResidence', 'residenceCountry', 'residenceAddress', 'residenceAddressLine2',
                            'purposeOfTravel', 'travellerType', 'airline', 'flightNumber', 'countryOfOrigin',
                            'airportOfOrigin', 'departureMonth', 'departureDay', 'departureYear', 'departureDate',
                            'destination', 'airportOfDestination', 'arrivalMonth', 'arrivalDay', 'arrivalYear',
                            'vesselName', 'origin', 'seaportOfOrigin', 'seaportOfDestination',
                            'customsDeclarationAttachment', 'currencyDeclarationAttachment', 'digitalSignature'
                          ].includes(key))
                          .map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <p className="text-sm font-medium text-gray-700">{formatFieldName(key)}</p>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                {formatFieldValue(value)}
                              </p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>No form data available</p>
                  <p className="text-sm">Customer hasn&apos;t filled out the form yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Status</p>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status, application.completed)}`}>
                    {application.completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    {application.completed ? 'Completed' : application.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Step</p>
                  <p className="text-sm text-gray-600">{application.current_step || 'Not started'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Form Completion</p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {Object.keys(application.form_data || {}).length} fields filled
                    </p>
                    {(() => {
                      const formData = application.form_data || {};
                      const hasDocuments = formData.customsDeclarationAttachment && formData.currencyDeclarationAttachment;
                      const hasSignature = formData.digitalSignature;
                      const hasProfilePicture = formData.picture;
                      
                      return (
                        <div className="text-xs space-y-1">
                          <div className={`flex items-center gap-1 ${hasProfilePicture ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{hasProfilePicture ? '✅' : '❌'}</span>
                            Profile Picture
                          </div>
                          <div className={`flex items-center gap-1 ${hasDocuments ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{hasDocuments ? '✅' : '❌'}</span>
                            Required Documents
                          </div>
                          <div className={`flex items-center gap-1 ${hasSignature ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{hasSignature ? '✅' : '❌'}</span>
                            Digital Signature
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Last Updated</p>
                  <p className="text-sm text-gray-600">
                    {new Date(application.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add notes about this application..."
                  />
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
