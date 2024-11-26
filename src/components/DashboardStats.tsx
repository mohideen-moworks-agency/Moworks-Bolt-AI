import React from 'react';
import { Globe, Building2, Users, BarChart } from 'lucide-react';
import { REGIONS, INDUSTRIES, COMPANY_SIZES, DEPARTMENTS } from '../constants/data';

const StatCard = ({ icon: Icon, title, value }: { icon: any, title: string, value: string }) => (
  <div className="stat-card">
    <div className="stat-icon">
      <Icon className="h-6 w-6" />
    </div>
    <div className="stat-content">
      <span className="stat-label">{title}</span>
      <span className="stat-value">{value}</span>
    </div>
  </div>
);

export default function DashboardStats() {
  return (
    <div className="stats-grid">
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