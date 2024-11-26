import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkRateLimit } from './rateLimit';
import { RateLimitError } from './errors';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your environment.');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

export interface AnalysisParams {
  region: string;
  industry: string;
  companySize: string;
  department: string;
  currentSystem: string;
  painPoints: string;
}

export interface AnalysisResult {
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
}

export async function generateAnalysis(params: AnalysisParams): Promise<AnalysisResult> {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  checkRateLimit();

  const prompt = `Act as a business analyst and provide a detailed analysis based on these company characteristics:
Region: ${params.region}
Industry: ${params.industry}
Company Size: ${params.companySize}
Department: ${params.department}
Current Systems: ${params.currentSystem}
Pain Points: ${params.painPoints}

Create 4 tables analyzing this specific situation:

Table 1 - Common Problems:
| Problem | Estimated Annual Cost | Impact Description | Root Causes |
First analyze all user-reported pain points:
${params.painPoints}

Then identify additional unresolved problems (excluding those addressed by current systems) based on:
- ${params.region} regional challenges
- ${params.industry} industry pain points
- ${params.department} specific issues
- ${params.companySize} scale-related challenges
Note: Only include problems that aren't being handled by their current systems.

Table 2 - Current Tools & Limitations:
| Problem | Current Tool/System | Limitations | Inefficiencies |
Analyze only the systems mentioned by the user:
${params.currentSystem}

Evaluate these systems specifically in context of:
- Requirements for ${params.region} region
- Standards for ${params.industry} industry
- Needs of ${params.department} department
- Scale requirements for ${params.companySize}
Note: Do not suggest additional tools - focus only on analyzing current systems.

Table 3 - Recommended Solutions:
| Problem | Recommended Solution | Implementation Complexity (Low/Medium/High) | Expected Timeline |
Address solutions for:
1. Each pain point mentioned: ${params.painPoints}
2. Additional problems identified

Ensure solutions are:
- Available in ${params.region}
- Compliant with ${params.industry} standards
- Appropriate for ${params.department}
- Scalable for ${params.companySize}

Table 4 - Benefits & ROI:
| Solution | Expected Benefits | Cost Savings | Value Generated | ROI Timeline |
For each recommended solution, analyze:
- Direct impact on reported pain points
- Cost savings potential
- Operational improvements
- Growth opportunities
- Risk mitigation value

After the tables, provide:
1. Total potential cost impact from implementing recommended solutions
2. Top 3 quick wins (based on pain points and solution complexity)
3. Strategic recommendations for phased implementation
4. Critical success factors for implementation

Present numbers as percentages unless specific values are certain. Format all findings in this JSON structure:
{
  "problems": [{"problem": "", "annualCost": "", "impact": "", "rootCauses": ""}],
  "tools": [{"problem": "", "tools": "", "limitations": "", "inefficiencies": ""}],
  "solutions": [{"problem": "", "solutions": "", "complexity": "", "timeline": ""}],
  "benefits": [{"problem": "", "benefits": "", "costSavings": "", "valueGenerated": "", "roiTimeline": ""}],
  "summary": {
    "costImpact": "",
    "quickWins": [""],
    "strategicRecommendations": [""],
    "successFactors": [""]
  }
}

Guidelines:
1. Start with user-provided pain points in problems analysis
2. Only analyze mentioned current systems
3. Ensure solutions directly address pain points
4. Calculate benefits based on recommended solutions
5. Consider regional, industry, departmental, and size context in all analyses
6. Make recommendations practical and implementable
7. Focus on actionable insights`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    try {
      const analysisData = JSON.parse(jsonMatch[0]);
      return analysisData;
    } catch (parseError) {
      console.error('Failed to parse Gemini API response:', parseError);
      throw new Error('Invalid JSON response from Gemini API');
    }
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('Gemini API error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate analysis');
  }
}