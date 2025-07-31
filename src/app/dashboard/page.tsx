'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Select } from '@/components/ui/Select';
import { EarningsChart } from '@/components/charts/EarningsChart';
import { EarningsSummary } from '@/components/EarningsSummary';
import { useAuth } from '@/contexts/AuthContext';
import { 
  managersApi, 
  ManagerEarnings, 
  generateMonthOptions 
} from '@/lib/api';
import { 
  Download, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [earnings, setEarnings] = useState<ManagerEarnings | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const monthOptions = generateMonthOptions();

  // Set default month to current month
  useEffect(() => {
    if (monthOptions.length > 0 && !selectedMonth) {
      setSelectedMonth(monthOptions[0].value);
    }
  }, [monthOptions, selectedMonth]);

  // Load earnings when month changes
  useEffect(() => {
    if (selectedMonth && user?.manager?.id) {
      loadEarnings();
    }
  }, [selectedMonth, user]);

  const loadEarnings = async () => {
    if (!selectedMonth || !user?.manager?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await managersApi.getEarnings(user.manager.id, selectedMonth);
      setEarnings(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayoutRequest = async () => {
    if (!earnings || earnings.totalEarnings <= 0) return;

    setPayoutLoading(true);
    setPayoutSuccess(false);

    try {
      await managersApi.requestPayout({
        managerId: earnings.managerId,
        period: earnings.period,
        amount: earnings.totalEarnings,
      });
      setPayoutSuccess(true);
      setTimeout(() => setPayoutSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request payout');
    } finally {
      setPayoutLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="page-header">
          <div className="container-app py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">T4M</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Manager Dashboard</h1>
                  <p className="text-sm text-gray-500">Welcome back, {user?.firstName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={loadEarnings}
                  disabled={loading}
                  className="btn-outline flex items-center text-sm px-4 py-2"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={logout}
                  className="btn-outline text-sm px-4 py-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container-app page-content">
          {/* Month Selector */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Earnings
                </h2>
                <p className="text-gray-600">
                  Select a month to view your detailed earnings breakdown
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Select
                  options={monthOptions}
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  placeholder="Select Month"
                  className="w-48"
                />
                {earnings && earnings.totalEarnings > 0 && (
                  <button
                    onClick={handlePayoutRequest}
                    disabled={payoutLoading}
                    className="btn-primary flex items-center"
                  >
                    {payoutLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Auszahlung beantragen
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Success Message */}
          {payoutSuccess && (
            <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl flex items-center">
              <CheckCircle className="w-5 h-5 text-success-600 mr-3" />
              <p className="text-success-700">
                Payout request submitted successfully! You will be notified once it's processed.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 text-error-600 mr-3" />
              <p className="text-error-700">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="card p-8 text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-600">Loading earnings data...</p>
            </div>
          )}

          {/* No Data */}
          {!loading && !earnings && selectedMonth && (
            <div className="card p-8 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Earnings Data
              </h3>
              <p className="text-gray-600 mb-4">
                No earnings data found for the selected month.
              </p>
              <button
                onClick={loadEarnings}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Earnings Data */}
          {!loading && earnings && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <EarningsSummary earnings={earnings} />
              
              {/* Chart */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Earnings Breakdown
                  </h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-2xl font-bold text-primary-600">
                      €{earnings.totalEarnings.toFixed(2)}
                    </p>
                  </div>
                </div>
                <EarningsChart earnings={earnings} />
              </div>

              {/* Payout Section */}
              {earnings.totalEarnings > 0 && (
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Ready for Payout
                      </h3>
                      <p className="text-gray-600">
                        Your earnings for {earnings.period} are ready to be requested for payout.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Available Amount</p>
                      <p className="text-3xl font-bold text-green-600 mb-4">
                        €{earnings.totalEarnings.toFixed(2)}
                      </p>
                      <button
                        onClick={handlePayoutRequest}
                        disabled={payoutLoading}
                        className="btn-primary flex items-center"
                      >
                        {payoutLoading ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Request Payout
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
} 