import React from 'react';
import { Table } from './Table';

interface AnalysisResultsProps {
  data: {
    problems: Array<{
      problem: string;
      annualCost: string;
      impact: string;
      rootCauses: string;
    }>;
    tools: Array<{
      problem: string;
      tools: string;
      limitations: string;
      inefficiencies: string;
    }>;
    solutions: Array<{
      problem: string;
      solutions: string;
      complexity: string;
      timeline: string;
    }>;
    benefits: Array<{
      problem: string;
      benefits: string;
      costSavings: string;
      valueGenerated: string;
      roiTimeline: string;
    }>;
    summary: {
      costImpact: string;
      quickWins: string[];
      strategicRecommendations: string[];
      successFactors: string[];
    };
  };
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Problems</h2>
        <Table
          headers={['Problem', 'Est. Annual Cost', 'Impact', 'Root Causes']}
          data={data.problems.map(p => [p.problem, p.annualCost, p.impact, p.rootCauses])}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Tools & Limitations</h2>
        <Table
          headers={['Problem', 'Common Tools', 'Limitations', 'Inefficiencies']}
          data={data.tools.map(t => [t.problem, t.tools, t.limitations, t.inefficiencies])}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Solutions</h2>
        <Table
          headers={['Problem', 'Solutions', 'Complexity', 'Timeline']}
          data={data.solutions.map(s => [s.problem, s.solutions, s.complexity, s.timeline])}
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits & ROI</h2>
        <Table
          headers={['Problem', 'Benefits', 'Cost Savings', 'Value Generated', 'ROI Timeline']}
          data={data.benefits.map(b => [
            b.problem,
            b.benefits,
            b.costSavings,
            b.valueGenerated,
            b.roiTimeline,
          ])}
        />
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Total Potential Cost Impact</h3>
          <p className="text-gray-700">{data.summary.costImpact}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Wins</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.summary.quickWins.map((win, index) => (
              <li key={index} className="text-gray-700">{win}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Strategic Recommendations</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.summary.strategicRecommendations.map((rec, index) => (
              <li key={index} className="text-gray-700">{rec}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Critical Success Factors</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.summary.successFactors.map((factor, index) => (
              <li key={index} className="text-gray-700">{factor}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}