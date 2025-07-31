'use client';

import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Award 
} from 'lucide-react';
import { ManagerEarnings } from '@/lib/api';

interface EarningsSummaryProps {
  earnings: ManagerEarnings;
}

export const EarningsSummary: React.FC<EarningsSummaryProps> = ({ earnings }) => {
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

  const summaryCards = [
    {
      title: 'Gesamtverdienst',
      value: formatCurrency(earnings.totalEarnings),
      icon: DollarSign,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      change: null,
    },
    {
      title: 'Grundprovision',
      value: formatCurrency(earnings.baseCommission),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: null,
    },
    {
      title: 'Creator Anzahl',
      value: earnings.creatorCount.toString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: null,
    },
    {
      title: 'Boni Total',
      value: formatCurrency(
        earnings.milestoneEarnings.total + 
        earnings.graduationBonus + 
        earnings.diamondBonus + 
        earnings.recruitmentBonus
      ),
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Earnings Overview
          </h2>
          <p className="text-gray-600">
            {formatMonth(earnings.period)} • {earnings.managerType.toUpperCase()} Manager
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(earnings.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${card.bgColor} ${card.color} mr-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <p className="text-xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Breakdown */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Earnings Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Base Commission */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Grundprovision</span>
            <span className="font-medium">{formatCurrency(earnings.baseCommission)}</span>
          </div>

          {/* Milestone Bonuses */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Half-Milestone</span>
            <span className="font-medium">{formatCurrency(earnings.milestoneEarnings.halfMilestone)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Milestone 1</span>
            <span className="font-medium">{formatCurrency(earnings.milestoneEarnings.milestone1)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Milestone 2</span>
            <span className="font-medium">{formatCurrency(earnings.milestoneEarnings.milestone2)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Retention</span>
            <span className="font-medium">{formatCurrency(earnings.milestoneEarnings.retention)}</span>
          </div>

          {/* Other Bonuses */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Graduation Bonus</span>
            <span className="font-medium">{formatCurrency(earnings.graduationBonus)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Diamond Bonus</span>
            <span className="font-medium">{formatCurrency(earnings.diamondBonus)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Recruitment Bonus</span>
            <span className="font-medium">{formatCurrency(earnings.recruitmentBonus)}</span>
          </div>

          {/* Downline for Team Managers */}
          {earnings.managerType === 'team' && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Downline Earnings</span>
              <span className="font-medium text-green-600">{formatCurrency(earnings.downlineEarnings)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 