import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkRateLimit } from './rateLimit';
import { RateLimitError } from './errors';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface AnalysisParams {
  region: string;
  industry: string;
  companySize: string;
  department: string;
  currentSystem: string;  // New field
  painPoints: string;     // New field
}

// AnalysisResult interface remains the same

export async function generateAnalysis(params: AnalysisParams): Promise<AnalysisResult> {
  // Check rate limit before making the API call
  checkRateLimit();

  const prompt = `Act as a senior business analyst and provide a detailed analysis based on these company characteristics:
Region: ${params.region}
Industry: ${params.industry}
Company Size: ${params.companySize}
Department: ${params.department}
Current Systems: ${params.currentSystem}
Pain Points: ${params.painPoints}

Create 4 detailed tables with professional business analysis:

Table 1 - Common Problems:
| Problem | Estimated Annual Cost | Impact Description | Root Causes |

Part A - Analyze user-reported pain points:
Take the provided pain points:
${params.painPoints}
Transform each into professional business language, providing:
- Clearly articulated problem statements
- Data-driven cost estimates
- Comprehensive impact analysis
- Root cause analysis using standard frameworks

Part B - Additional Common Problems:
Identify industry-standard problems that:
1. Are NOT currently resolved by their systems: ${params.currentSystem}
2. Are relevant to their context:
   - ${params.region} regional context
   - ${params.industry} industry standards
   - ${params.department} operations
   - ${params.companySize} scale considerations
Present these in professional business terminology with:
- Clear problem definitions
- Evidence-based cost estimates
- Impact analysis using business metrics
- Systematic root cause analysis

Table 2 - Current Tools & Limitations:
| Problem | Common Tools | Limitations | Inefficiencies |

Analyze only their stated systems:
${params.currentSystem}
Transform the analysis into professional business language, evaluating:
1. Problem statements these tools address
2. Tool capabilities and implementations
3. Limitation analysis considering:
   - ${params.region} regional requirements
   - ${params.industry} industry standards
   - ${params.department} specific needs
   - ${params.companySize} scale demands
4. Efficiency gaps and operational impacts

Table 3 - Recommended Solutions:
| Problem | Solutions | Implementation Complexity | Timeline |

Develop solutions addressing:
1. Each analyzed pain point
2. Each identified common problem

Ensure solutions:
- Align with ${params.region} market availability
- Meet ${params.industry} standards
- Suit ${params.department} workflows
- Scale for ${params.companySize}

Present in professional business language:
- Clear solution architectures
- Complexity analysis (Low/Medium/High) with rationale
- Detailed implementation timelines
- Resource requirements
- Risk considerations

Table 4 - Benefits & ROI:
| Solution | Expected Benefits | Cost Savings | Value Generated | ROI Timeline |

For each recommended solution, provide professional analysis of:
1. Quantifiable benefits:
   - Direct cost savings
   - Efficiency gains
   - Resource optimization
2. Strategic value:
   - Competitive advantages
   - Growth enablement
   - Risk mitigation
3. ROI calculations:
   - Implementation costs
   - Expected returns
   - Payback periods

Conclude with:
1. Total cost impact analysis with business case
2. Quick wins prioritized by:
   - Implementation ease
   - Impact magnitude
   - Resource requirements
3. Strategic roadmap recommendations
4. Critical success factors and KPIs

Format response in this JSON structure:
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

Requirements:
1. Use professional business analysis language throughout
2. Provide data-driven insights where possible
3. Use industry-standard metrics and benchmarks
4. Ensure all analyses consider regional, industry, departmental, and scale contexts
5. Present costs as percentages unless specific values are verifiable
6. Use recognized business frameworks and methodologies
7. Maintain consistency in terminology and metrics
8. Ensure all recommendations are actionable and practical`;

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