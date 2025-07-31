'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Select } from '@/components/ui/Select';
import { 
  managersApi, 
  ManagerEarnings, 
  generateMonthOptions 
} from '@/lib/api';
import { 
  BarChart3, 
  Download, 
  RefreshCw, 
  AlertCircle,
  DollarSign,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';

export default function AdminReportsPage() {
  const [earnings, setEarnings] = useState<ManagerEarnings[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('totalEarnings');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const monthOptions = generateMonthOptions();

  // Set default month to current month
  useEffect(() => {
    if (monthOptions.length > 0 && !selectedMonth) {
      setSelectedMonth(monthOptions[0].value);
    }
  }, [monthOptions, selectedMonth]);

  // Load earnings when month changes
  useEffect(() => {
    if (selectedMonth) {
      loadEarnings();
    }
  }, [selectedMonth]);

  const loadEarnings = async () => {
    if (!selectedMonth) return;

    setLoading(true);
    setError(null);

    try {
      const response = await managersApi.getAllEarnings(selectedMonth);
      setEarnings(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatMonth = (period: string) => {
    if (period.length === 6) {
      const year = period.substring(0, 4);
      const month = period.substring(4, 6);
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('de-DE', { 
        year: 'numeric', 
        month: 'long' 
      });
    }
    return period;
  };

  const sortedEarnings = [...earnings].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortBy) {
      case 'managerName':
        aValue = a.managerName;
        bValue = b.managerName;
        break;
      case 'managerType':
        aValue = a.managerType;
        bValue = b.managerType;
        break;
      case 'totalEarnings':
        aValue = a.totalEarnings;
        bValue = b.totalEarnings;
        break;
      case 'baseCommission':
        aValue = a.baseCommission;
        bValue = b.baseCommission;
        break;
      case 'creatorCount':
        aValue = a.creatorCount;
        bValue = b.creatorCount;
        break;
      case 'totalRevenue':
        aValue = a.totalRevenue;
        bValue = b.totalRevenue;
        break;
      default:
        aValue = a.totalEarnings;
        bValue = b.totalEarnings;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const totalStats = earnings.reduce((acc, earning) => ({
    totalEarnings: acc.totalEarnings + earning.totalEarnings,
    totalRevenue: acc.totalRevenue + earning.totalRevenue,
    totalCreators: acc.totalCreators + earning.creatorCount,
    managerCount: acc.managerCount + 1,
  }), { totalEarnings: 0, totalRevenue: 0, totalCreators: 0, managerCount: 0 });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Manager Name',
      'Type',
      'Total Earnings',
      'Base Commission',
      'Milestone Total',
      'Graduation Bonus',
      'Diamond Bonus',
      'Recruitment Bonus',
      'Downline Earnings',
      'Creator Count',
      'Total Revenue'
    ];

    const csvData = [
      headers.join(','),
      ...sortedEarnings.map(earning => [
        earning.managerName,
        earning.managerType.toUpperCase(),
        earning.totalEarnings.toFixed(2),
        earning.baseCommission.toFixed(2),
        earning.milestoneEarnings.total.toFixed(2),
        earning.graduationBonus.toFixed(2),
        earning.diamondBonus.toFixed(2),
        earning.recruitmentBonus.toFixed(2),
        earning.downlineEarnings.toFixed(2),
        earning.creatorCount,
        earning.totalRevenue.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manager-earnings-${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="page-header">
          <div className="container-app py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-primary-600 mr-4" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Manager Reports
                  </h1>
                  <p className="text-gray-600">
                    View and analyze all manager earnings
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {earnings.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="btn-outline flex items-center text-sm px-4 py-2"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                )}
                <button
                  onClick={loadEarnings}
                  disabled={loading}
                  className="btn-outline flex items-center text-sm px-4 py-2"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container-app page-content">
          {/* Controls */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedMonth ? formatMonth(selectedMonth) : 'Select Month'}
                </h2>
                <p className="text-gray-600">
                  Comprehensive earnings report for all managers
                </p>
              </div>
              <Select
                options={monthOptions}
                value={selectedMonth}
                onChange={setSelectedMonth}
                placeholder="Select Month"
                className="w-48"
              />
            </div>
          </div>

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

          {/* Summary Cards */}
          {!loading && earnings.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-primary-50 text-primary-600 mr-4">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Earnings</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(totalStats.totalEarnings)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 mr-4">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(totalStats.totalRevenue)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-green-50 text-green-600 mr-4">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Creators</p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalStats.totalCreators}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-purple-50 text-purple-600 mr-4">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Managers</p>
                      <p className="text-xl font-bold text-gray-900">
                        {totalStats.managerCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Table */}
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Manager Earnings Details
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('managerName')}
                        >
                          Manager
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('managerType')}
                        >
                          Type
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('totalEarnings')}
                        >
                          Total Earnings
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('baseCommission')}
                        >
                          Base Commission
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Milestone Bonuses
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Other Bonuses
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('creatorCount')}
                        >
                          Creators
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('totalRevenue')}
                        >
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedEarnings.map((earning) => (
                        <tr key={earning.managerId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="font-medium text-gray-900">{earning.managerName}</p>
                              <p className="text-sm text-gray-500">{earning.managerId}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              earning.managerType === 'live' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {earning.managerType.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                            {formatCurrency(earning.totalEarnings)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {formatCurrency(earning.baseCommission)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <p className="text-gray-900">{formatCurrency(earning.milestoneEarnings.total)}</p>
                              <p className="text-gray-500">
                                H: {formatCurrency(earning.milestoneEarnings.halfMilestone)} • 
                                M1: {formatCurrency(earning.milestoneEarnings.milestone1)} • 
                                M2: {formatCurrency(earning.milestoneEarnings.milestone2)} • 
                                R: {formatCurrency(earning.milestoneEarnings.retention)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <p className="text-gray-900">
                                {formatCurrency(
                                  earning.graduationBonus + 
                                  earning.diamondBonus + 
                                  earning.recruitmentBonus + 
                                  earning.downlineEarnings
                                )}
                              </p>
                              <p className="text-gray-500">
                                G: {formatCurrency(earning.graduationBonus)} • 
                                D: {formatCurrency(earning.diamondBonus)} • 
                                R: {formatCurrency(earning.recruitmentBonus)}
                                {earning.managerType === 'team' && ` • DL: ${formatCurrency(earning.downlineEarnings)}`}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {earning.creatorCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {formatCurrency(earning.totalRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* No Data */}
          {!loading && earnings.length === 0 && selectedMonth && (
            <div className="card p-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                Retry
              </button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
} 