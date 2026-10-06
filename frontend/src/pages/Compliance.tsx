import { useEffect, useState } from 'react';
import complianceChecker, { ComplianceResult } from '../utils/compliance';

export default function CompliancePage() {
  const [results, setResults] = useState<ComplianceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{ total: number; passed: number; failed: number; percentage: number } | null>(null);

  const runCompliance = async () => {
    setLoading(true);
    try {
      const testResults = await complianceChecker.runAllTests();
      setResults(testResults);
      setSummary(complianceChecker.getSummary());
    } catch (error) {
      console.error('Compliance test error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run tests on mount
    runCompliance();
  }, []);

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      Security: '🔒',
      Privacy: '🔐',
      Accessibility: '♿',
      Performance: '⚡',
    };
    return icons[category] || '✓';
  };

  const getSeverityColor = (severity: string): string => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 border-red-300 text-red-800',
      high: 'bg-orange-100 border-orange-300 text-orange-800',
      medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      low: 'bg-blue-100 border-blue-300 text-blue-800',
    };
    return colors[severity] || 'bg-gray-100';
  };

  const groupedResults = results.reduce(
    (acc, result) => {
      if (!acc[result.category]) acc[result.category] = [];
      acc[result.category].push(result);
      return acc;
    },
    {} as Record<string, ComplianceResult[]>
  );

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Compliance Testing</h1>
          <p className="text-gray-600 mb-6">
            PIVIT Fishing application compliance verification across security, privacy, accessibility, and performance standards.
          </p>
          <button onClick={runCompliance} disabled={loading} className="btn btn-secondary px-6 py-2">
            {loading ? '⏳ Running Tests...' : '🔄 Run Tests'}
          </button>
        </div>

        {/* Summary Card */}
        {summary && (
          <div className="card mb-8 border-l-4 border-secondary">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary">{summary.percentage}%</div>
                <p className="text-gray-600">Overall Score</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{summary.passed}</div>
                <p className="text-gray-600">Passed Tests</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600">{summary.failed}</div>
                <p className="text-gray-600">Failed Tests</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{summary.total}</div>
                <p className="text-gray-600">Total Tests</p>
              </div>
            </div>
          </div>
        )}

        {/* Results by Category */}
        <div className="space-y-8">
          {Object.entries(groupedResults).map(([category, categoryResults]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-3 text-3xl">{getCategoryIcon(category)}</span>
                {category} Tests
              </h2>

              <div className="space-y-3">
                {categoryResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`card border-l-4 ${result.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`text-xl mr-3 ${result.passed ? '✅' : '❌'}`}></span>
                          <h3 className="text-lg font-semibold">{result.test}</h3>
                          <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(result.severity)}`}>
                            {result.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-700 ml-8">{result.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Standards */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Compliance Standards</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ <strong>Security:</strong> HTTPS, CSRF protection, secure API endpoints, input validation</li>
            <li>✓ <strong>Privacy:</strong> Privacy policy, data collection disclosure, cookie consent</li>
            <li>✓ <strong>Accessibility:</strong> WCAG 2.1 Level AA compliance, keyboard navigation, color contrast</li>
            <li>✓ <strong>Performance:</strong> Load time optimization, mobile responsiveness, PWA features</li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Recommended Actions</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Review failed compliance tests and resolve critical issues</li>
            <li>• Implement privacy policy and cookie consent mechanisms</li>
            <li>• Add proper error handling and input validation</li>
            <li>• Consider using accessibility testing tools like axe-core for deeper analysis</li>
            <li>• Set up continuous monitoring for compliance standards</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
