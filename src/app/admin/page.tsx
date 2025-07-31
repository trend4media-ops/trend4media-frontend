'use client';

import React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileSpreadsheet,
  BarChart3,
  Users,
  Award,
  Settings,
  TrendingUp,
  Upload,
  DollarSign
} from 'lucide-react';

export default function AdminPage() {
  const { user, logout } = useAuth();

  const adminFeatures = [
    {
      title: 'Excel Upload',
      description: 'Upload and process monthly Excel files with creator data and manager assignments',
      icon: Upload,
      href: '/admin/upload',
      color: 'bg-blue-50 text-blue-600',
      stats: 'Process creator data & commissions',
    },
    {
      title: 'Manager Reports',
      description: 'View comprehensive earnings reports for all managers with export functionality',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-green-50 text-green-600',
      stats: 'Analytics & export tools',
    },
    {
      title: 'Genealogy Management',
      description: 'Manage Team-Manager downline assignments and commission structures',
      icon: Users,
      href: '/admin/genealogy',
      color: 'bg-purple-50 text-purple-600',
      stats: 'Live → Team assignments',
    },
    {
      title: 'Bonus Management',
      description: 'Award recruitment bonuses to managers for successful talent acquisition',
      icon: Award,
      href: '/admin/bonuses',
      color: 'bg-orange-50 text-orange-600',
      stats: 'Manual bonus awards',
    },
  ];

  const quickStats = [
    {
      title: 'Monthly Processing',
      value: 'Excel Upload',
      icon: FileSpreadsheet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Commission Engine',
      value: 'Active',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Downline System',
      value: 'Genealogy',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Payout System',
      value: 'Ready',
      icon: DollarSign,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
  ];

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="page-header">
          <div className="container-app py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-white text-lg font-bold">T4M</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-gray-600">Welcome back, {user?.firstName} • System Administration</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="btn-outline text-sm px-4 py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container-app page-content">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} mr-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {adminFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link 
                  key={index}
                  href={feature.href}
                  className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
                >
                  <div className="flex items-start">
                    <div className={`p-4 rounded-xl ${feature.color} mr-4 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-sm">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {feature.stats}
                        </span>
                        <span className="ml-3 text-primary-600 font-medium group-hover:underline">
                          Access →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* System Status */}
          <div className="card p-6">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">
                System Status
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-success-50 rounded-xl">
                <div className="w-3 h-3 bg-success-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-success-900">Authentication</p>
                <p className="text-sm text-success-700">Operational</p>
              </div>
              
              <div className="text-center p-4 bg-success-50 rounded-xl">
                <div className="w-3 h-3 bg-success-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-success-900">Commission Engine</p>
                <p className="text-sm text-success-700">Calculating</p>
              </div>
              
              <div className="text-center p-4 bg-success-50 rounded-xl">
                <div className="w-3 h-3 bg-success-500 rounded-full mx-auto mb-2"></div>
                <p className="font-medium text-success-900">Database</p>
                <p className="text-sm text-success-700">Connected</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
              <h3 className="font-medium text-primary-900 mb-2">
                🚀 System Overview
              </h3>
              <p className="text-primary-700 text-sm">
                The trend4media commission system is fully operational. All core features are available: 
                Excel processing, commission calculations, genealogy management, and payout processing.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 