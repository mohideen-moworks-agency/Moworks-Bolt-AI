import React from 'react';
import { Globe, Building2, Users, BarChart, Database, AlertCircle } from 'lucide-react';
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
  currentSystem: string;
  painPoints: string;
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
  <div className="input-group">
    <label htmlFor={name} className="input-label">
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

const TextAreaField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  placeholder
}: {
  icon: any;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) => (
  <div className="input-group">
    <label htmlFor={name} className="input-label">
      {label}
    </label>
    <div className="relative">
      <div className="absolute top-4 left-0 pl-4 pointer-events-none">
        <Icon className="h-5 w-5 text-coral" />
      </div>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="input-select min-h-[120px] resize-y"
      />
    </div>
  </div>
);

export default function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    region: '',
    industry: '',
    companySize: '',
    department: '',
    currentSystem: '',
    painPoints: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="form-grid">
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
        <TextAreaField
          icon={Database}
          label="Current System"
          name="currentSystem"
          value={formData.currentSystem}
          onChange={handleChange}
          placeholder="Describe your existing tools and systems..."
        />
        <TextAreaField
          icon={AlertCircle}
          label="Pain Points"
          name="painPoints"
          value={formData.painPoints}
          onChange={handleChange}
          placeholder="List your current challenges and problems..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.region || !formData.industry || 
                 !formData.companySize || !formData.department || 
                 !formData.currentSystem || !formData.painPoints}
        className="btn-primary w-full"
      >
        {isLoading ? 'Generating Analysis...' : 'Generate Analysis'}
      </button>
    </form>
  );
}