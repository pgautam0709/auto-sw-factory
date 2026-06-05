import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  accent?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}

const accentStyles = {
  blue: 'bg-ford-50 text-ford-600 border-ford-100',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  red: 'bg-red-50 text-red-600 border-red-100',
};

export default function MetricCard({ label, value, sub, icon, accent = 'blue' }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${accentStyles[accent]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
