import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  color: 'coral' | 'cyan' | 'orange' | 'slate';
}

const colorClasses = {
  coral: {
    icon: 'text-coral-500 bg-coral-50',
    border: 'border-coral-200',
    trend: 'text-coral-600'
  },
  cyan: {
    icon: 'text-cyan-500 bg-cyan-50',
    border: 'border-cyan-200',
    trend: 'text-cyan-600'
  },
  orange: {
    icon: 'text-orange-500 bg-orange-50',
    border: 'border-orange-200',
    trend: 'text-orange-600'
  },
  slate: {
    icon: 'text-slate-500 bg-slate-50',
    border: 'border-slate-200',
    trend: 'text-slate-600'
  }
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color
}) => {
  const classes = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border ${classes.border} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${classes.icon}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-slate-700">{value.toLocaleString()}</p>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};