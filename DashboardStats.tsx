import React from 'react';
import { Globe, Building2, Users, BarChart } from 'lucide-react';
import { REGIONS, INDUSTRIES, COMPANY_SIZES, DEPARTMENTS } from '../constants/data';

const StatCard = ({ icon: Icon, title, value }: { icon: any, title: string, value: string }) => (
  <div className="stat-card">
    <div className="stat-icon">
      <Icon className="h-5 w-5" />
    </div>
    <div className="stat-content">
      <span className="stat-label">{title}</span>
      <span className="stat-value">{value}</span>
    </div>
  </div>
);

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={Globe}
        title="Global Research"
        value={`${REGIONS.length}+ Regions`}
      />
      <StatCard
        icon={Building2}
        title="Industries"
        value={`${INDUSTRIES.length}+ Sectors`}
      />
      <StatCard
        icon={Users}
        title="Company Size"
        value="1-5000+"
      />
      <StatCard
        icon={BarChart}
        title="Departments"
        value={`${DEPARTMENTS.length}+ Teams`}
      />
    </div>
  );
}