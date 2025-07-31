'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ManagerEarnings } from '@/lib/api';

interface EarningsChartProps {
  earnings: ManagerEarnings;
}

export const EarningsChart: React.FC<EarningsChartProps> = ({ earnings }) => {
  const chartData = [
    {
      name: 'Grundprovision',
      value: earnings.baseCommission,
      color: '#ED0C81',
    },
    {
      name: 'Half-Milestone',
      value: earnings.milestoneEarnings.halfMilestone,
      color: '#f472b6',
    },
    {
      name: 'Milestone 1',
      value: earnings.milestoneEarnings.milestone1,
      color: '#ec4899',
    },
    {
      name: 'Milestone 2',
      value: earnings.milestoneEarnings.milestone2,
      color: '#db2777',
    },
    {
      name: 'Retention',
      value: earnings.milestoneEarnings.retention,
      color: '#be185d',
    },
    {
      name: 'Graduation',
      value: earnings.graduationBonus,
      color: '#9d174d',
    },
    {
      name: 'Diamond',
      value: earnings.diamondBonus,
      color: '#831843',
    },
    {
      name: 'Recruitment',
      value: earnings.recruitmentBonus,
      color: '#500724',
    },
  ];

  // Add downline earnings for team managers
  if (earnings.managerType === 'team' && earnings.downlineEarnings > 0) {
    chartData.push({
      name: 'Downline',
      value: earnings.downlineEarnings,
      color: '#22c55e',
    });
  }

  // Filter out zero values for cleaner chart
  const filteredData = chartData.filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-primary-600">
            <span className="font-medium">€{data.value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={filteredData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}; 