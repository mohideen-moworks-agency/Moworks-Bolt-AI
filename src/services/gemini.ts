import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkRateLimit } from './rateLimit';
import { RateLimitError } from './errors';

// Ensure API key is properly accessed
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

  const prompt = `Act as a business analyst and provide a detailed analysis in table format for a company with the following characteristics:
Region: ${params.region}
Industry: ${params.industry}
Company Size: ${params.companySize}
Department: ${params.department}
Current Systems: ${params.currentSystem}
Pain Points: ${params.painPoints}

For this specific combination, create 4 tables:

Table 1 - Common Problems:
| Problem | Estimated Annual Cost | Impact Description | Root Causes |
First list the following user-reported pain points with your analysis of their costs, impacts, and root causes:
${params.painPoints}

Then add additional potential problems you identify based on:
- Regional challenges specific to ${params.region}
- Industry-specific issues in ${params.industry}
- Department-specific challenges in ${params.department}
- Scale-related issues for ${params.companySize}
- System-related problems from ${params.currentSystem}

Table 2 - Current Tools & Limitations:
| Problem | Commonly Used Tools | Tool Limitations | Inefficiencies |
Analyze the following current systems and their limitations:
${params.currentSystem}
Consider:
- Integration capabilities
- Scalability for ${params.companySize}
- Regional compliance requirements for ${params.region}
- Industry-specific requirements for ${params.industry}
- Department-specific needs for ${params.department}

Table 3 - Recommended Solutions:
| Problem | Recommended Solutions | Implementation Complexity (Low/Medium/High) | Expected Timeline |
Provide solutions that specifically address:
1. Each of the user's reported pain points: ${params.painPoints}
2. Each limitation identified in their current systems: ${params.currentSystem}
3. Additional problems identified based on region, industry, department, and size
Consider:
- Regional availability of solutions in ${params.region}
- Industry best practices for ${params.industry}
- Department-specific workflows for ${params.department}
- Scalability requirements for ${params.companySize}

Table 4 - Benefits & ROI:
| Problem | Expected Benefits | Cost Savings | Additional Value Generated | Expected ROI Timeline |
Calculate benefits considering:
1. Direct resolution of reported pain points: ${params.painPoints}
2. Improvements over current systems: ${params.currentSystem}
3. Regional factors in ${params.region} (market rates, labor costs)
4. Industry standards in ${params.industry}
5. Department-specific improvements for ${params.department}
6. Scale-appropriate benefits for ${params.companySize}

After the tables, provide:
1. Total potential cost impact (considering all inputs, regional factors, and industry benchmarks)
2. Top 3 quick wins (prioritizing user's immediate pain points and easy-to-implement solutions)
3. Long-term strategic recommendations (based on industry trends, company size, and regional factors)
4. Critical success factors (specific to their context, industry, and scale)

Try to give most numbers in percent than actual numbers unless those are correct ones.

Format the response as a JSON object with the following structure:
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
}`;

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