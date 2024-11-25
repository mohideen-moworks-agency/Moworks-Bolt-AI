import React from 'react';
import { Globe, Building2, Users, BarChart } from 'lucide-react';
import { REGIONS, INDUSTRIES, COMPANY_SIZES, DEPARTMENTS } from '../constants/data';

interface AnalysisFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

interface FormData {
  region: string;
  industry: string;
  companySize: string;
  department: string;
}

const SelectField = ({ 
  icon: Icon, 
  label, 
  name, 
  options, 
  value, 
  onChange 
}: { 
  icon: any;
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-coral" />
      </div>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="input-select"
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    region: '',
    industry: '',
    companySize: '',
    department: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          icon={Globe}
          label="Region"
          name="region"
          options={REGIONS}
          value={formData.region}
          onChange={handleChange}
        />
        <SelectField
          icon={Building2}
          label="Industry"
          name="industry"
          options={INDUSTRIES}
          value={formData.industry}
          onChange={handleChange}
        />
        <SelectField
          icon={Users}
          label="Company Size"
          name="companySize"
          options={COMPANY_SIZES}
          value={formData.companySize}
          onChange={handleChange}
        />
        <SelectField
          icon={BarChart}
          label="Department"
          name="department"
          options={DEPARTMENTS}
          value={formData.department}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.region || !formData.industry || !formData.companySize || !formData.department}
        className="btn-primary w-full"
      >
        {isLoading ? 'Generating Analysis...' : 'Generate Analysis'}
      </button>
    </form>
  );
}