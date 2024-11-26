import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkRateLimit } from './rateLimit';
import { RateLimitError } from './errors';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface AnalysisParams {
  region: string;
  industry: string;
  companySize: string;
  department: string;
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
  // Check rate limit before making the API call
  checkRateLimit();

  const prompt = `Act as a business analyst and provide a detailed analysis in table format for a company with the following characteristics:
Region: ${params.region}
Industry: ${params.industry}
Company Size: ${params.companySize}
Department: ${params.department}

For this specific combination, create 4 tables:
Table 1 - Common Problems:
| Problem | Estimated Annual Cost | Impact Description | Root Causes |

Table 2 - Current Tools & Limitations:
| Problem | Commonly Used Tools | Tool Limitations | Inefficiencies |

Table 3 - Recommended Solutions:
| Problem | Recommended Solutions | Implementation Complexity (Low/Medium/High) | Expected Timeline |

Table 4 - Benefits & ROI:
| Problem | Expected Benefits | Cost Savings | Additional Value Generated | Expected ROI Timeline |

Please ensure:
1. Costs are realistic for the company size and region
2. Solutions are appropriate for the specified company size
3. Include industry-specific regulations and compliance requirements
4. Consider regional differences in technology adoption and costs
5. Account for department-specific workflows and challenges
6. Include both direct and indirect costs
7. Consider current market solutions and best practices
8. Provide quantifiable metrics where possible

After the tables, provide:
1. Total potential cost impact
2. Top 3 quick wins
3. Long-term strategic recommendations
4. Critical success factors

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
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const analysisData = JSON.parse(jsonMatch[0]);
    return analysisData;
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error;
    }
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate analysis');
  }
}