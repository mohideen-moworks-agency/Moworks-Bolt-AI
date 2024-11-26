import React from 'react';
import { Download, Linkedin } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import DashboardStats from './components/DashboardStats';
import AnalysisForm from './components/AnalysisForm';
import AnalysisResults from './components/AnalysisResults';
import { RateLimitInfo } from './components/RateLimitInfo';
import { generateAnalysis } from './services/gemini';
import { RateLimitError } from './services/errors';
import type { AnalysisResult, AnalysisParams } from './services/gemini';

function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<AnalysisResult | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = async (formData: AnalysisParams) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.');
      }
      const analysis = await generateAnalysis(formData);
      setResults(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      if (error instanceof RateLimitError) {
        setError(error.message);
      } else {
        setError(error instanceof Error ? error.message : 'Failed to generate analysis. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!resultsRef.current) return;

    const element = resultsRef.current;
    const opt = {
      margin: 1,
      filename: 'business-analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-coral text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/moworks-logo.svg" alt="CIO Assist" className="h-10 w-10" />
              <h1 className="text-3xl font-bold">CIO Assist</h1>
            </div>
            <div className="flex items-center space-x-6">
              <RateLimitInfo />
              <a
                href="https://linkedin.com/in/mohideen38"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span>Connect on LinkedIn</span>
              </a>
              {results && (
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats />
        
        <div className="space-y-8">
          <div className="form-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 px-8 pt-8">Analysis Parameters</h2>
            <AnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
            {error && (
              <div className="mx-8 mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {results && !isLoading && (
            <div ref={resultsRef}>
              <AnalysisResults data={results} />
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;