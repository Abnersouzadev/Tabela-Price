import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  highlight?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, subValue, icon: Icon, highlight }) => {
  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${highlight ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-800 shadow-sm'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 ${highlight ? 'text-gray-300' : 'text-gray-500'}`}>{label}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          {subValue && (
            <p className={`text-xs mt-2 ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>
              {subValue}
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <Icon size={20} className={highlight ? 'text-white' : 'text-gray-600'} />
        </div>
      </div>
    </div>
  );
};