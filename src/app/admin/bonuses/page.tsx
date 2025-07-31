'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Select } from '@/components/ui/Select';
import { 
  managersApi, 
  generateMonthOptions 
} from '@/lib/api';
import { 
  Award, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Users,
  Send
} from 'lucide-react';

export default function AdminBonusesPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    managerId: '',
    period: '',
    managerType: 'live' as 'live' | 'team',
    description: '',
  });

  const monthOptions = generateMonthOptions();
  const managerTypeOptions = [
    { value: 'live', label: 'Live Manager (€50)' },
    { value: 'team', label: 'Team Manager (€60)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.managerId || !formData.period) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await managersApi.awardRecruitmentBonus({
        managerId: formData.managerId,
        period: formData.period,
        managerType: formData.managerType,
        description: formData.description || `Recruitment bonus for ${formData.managerType} manager`,
      });

      setSuccess(`Recruitment bonus successfully awarded to ${formData.managerType} manager!`);
      
      // Reset form
      setFormData({
        managerId: '',
        period: '',
        managerType: 'live',
        description: '',
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to award recruitment bonus');
    } finally {
      setLoading(false);
    }
  };

  const getBonusAmount = (type: 'live' | 'team') => {
    return type === 'live' ? 50 : 60;
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="page-header">
          <div className="container-app py-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bonus Management
                </h1>
                <p className="text-gray-600">
                  Award recruitment bonuses to managers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container-app page-content">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl flex items-center">
                <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
                <p className="text-success-700">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 text-error-600 mr-3" />
                <p className="text-error-700">{error}</p>
              </div>
            )}

            {/* Bonus Form */}
            <div className="card p-6">
              <div className="flex items-center mb-6">
                <DollarSign className="w-6 h-6 text-primary-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Award Recruitment Bonus
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Manager ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager ID *
                    </label>
                    <input
                      type="text"
                      value={formData.managerId}
                      onChange={(e) => setFormData(prev => ({ ...prev, managerId: e.target.value }))}
                      className="input-field"
                      placeholder="Enter Manager UUID"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      UUID of the manager to receive the bonus
                    </p>
                  </div>

                  {/* Manager Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manager Type *
                    </label>
                    <Select
                      options={managerTypeOptions}
                      value={formData.managerType}
                      onChange={(value) => setFormData(prev => ({ ...prev, managerType: value as 'live' | 'team' }))}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Bonus amount: €{getBonusAmount(formData.managerType)}
                    </p>
                  </div>

                  {/* Period */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period *
                    </label>
                    <Select
                      options={monthOptions}
                      value={formData.period}
                      onChange={(value) => setFormData(prev => ({ ...prev, period: value }))}
                      placeholder="Select Month"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Month for which the bonus is awarded
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field h-24 resize-none"
                      placeholder="Optional description for the bonus..."
                    />
                  </div>
                </div>

                {/* Bonus Preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Bonus Preview</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium">
                        {formData.managerType.charAt(0).toUpperCase() + formData.managerType.slice(1)} Manager
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-2 font-medium text-green-600">
                        €{getBonusAmount(formData.managerType)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Period:</span>
                      <span className="ml-2 font-medium">
                        {formData.period ? monthOptions.find(m => m.value === formData.period)?.label : 'Not selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Manager:</span>
                      <span className="ml-2 font-medium">
                        {formData.managerId || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={loading || !formData.managerId || !formData.period}
                    className="btn-primary flex items-center"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Awarding Bonus...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Award Bonus
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Information Card */}
            <div className="card p-6 mt-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Recruitment Bonus Information
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Live Manager Bonus</h4>
                  <p className="text-blue-700 text-sm">
                    €50 recruitment bonus for Live Managers who successfully recruit new high-performing talent.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-medium text-green-900 mb-2">Team Manager Bonus</h4>
                  <p className="text-green-700 text-sm">
                    €60 recruitment bonus for Team Managers who successfully recruit new high-performing talent.
                  </p>
                </div>
                
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Recruitment bonuses are manually awarded by administrators</li>
                    <li>• Bonuses are added to the manager's earnings for the specified month</li>
                    <li>• Each bonus requires approval and should be documented</li>
                    <li>• Bonuses will appear in the manager's earnings breakdown</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 