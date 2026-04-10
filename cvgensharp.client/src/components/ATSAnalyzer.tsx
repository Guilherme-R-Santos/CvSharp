import { useState, useEffect } from 'react';
import type { CVData } from '@/types/cv';
import { calculateATSScore, getATSScoreBadgeColor } from '@/utils/helpers';
import { TrendingUp, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface ATSAnalyzerProps {
  cvData: CVData;
}

interface ATSResponse {
  atsScore?: number;
  keywords?: string[];
  suggestions?: string[];
}

export function ATSAnalyzer({ cvData }: ATSAnalyzerProps) {
  const [atsData, setATSData] = useState<ATSResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const localScore = calculateATSScore(cvData);

  const analyzeForATS = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cv/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvData),
      });

      if (response.ok) {
        const data = await response.json();
        setATSData(data);
      }
    } catch (error) {
      console.error('Erro ao analisar ATS:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeForATS();
  }, [cvData]);

  const score = atsData?.atsScore ?? localScore;
  const keywords = atsData?.keywords ?? [];
  const suggestions = atsData?.suggestions ?? [];

  const getScoreText = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Aceitável';
    return 'Precisa Melhorar';
  };

  const badgeColor = getATSScoreBadgeColor(score);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg">
            <span className={`text-2xl font-bold ${badgeColor} rounded-full w-14 h-14 flex items-center justify-center`}>
              {Math.round(score)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Score ATS</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{getScoreText(score)}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
        >
          {showDetails ? 'Ocultar' : 'Ver'} Detalhes
        </button>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compatibilidade</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{Math.round(score)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              score >= 80
                ? 'bg-green-500'
                : score >= 60
                  ? 'bg-yellow-500'
                  : score >= 40
                    ? 'bg-orange-500'
                    : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {showDetails && (
        <div className="space-y-6 border-t border-purple-200 dark:border-purple-800 pt-6">
          {/* Keywords */}
          {keywords.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Palavras-chave Detectadas
              </h4>
              <div className="flex flex-wrap gap-2">
                {keywords.slice(0, 15).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 rounded-full text-xs font-medium"
                  >
                    {keyword}
                  </span>
                ))}
                {keywords.length > 15 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                    +{keywords.length - 15} mais
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                Sugestões de Melhoria
              </h4>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Completeness */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Seções Preenchidas
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Informações Pessoais</span>
                {cvData.personalInfo?.fullName && cvData.personalInfo?.email ? (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                ) : (
                  <span className="text-gray-400">○</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Experiência ({cvData.experience.length})</span>
                {cvData.experience.length > 0 ? (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                ) : (
                  <span className="text-gray-400">○</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Educação ({cvData.education.length})</span>
                {cvData.education.length > 0 ? (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                ) : (
                  <span className="text-gray-400">○</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Habilidades ({cvData.skills.length})</span>
                {cvData.skills.length >= 5 ? (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                ) : (
                  <span className="text-gray-400">○</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Projetos ({cvData.projects.length})</span>
                {cvData.projects.length > 0 ? (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                ) : (
                  <span className="text-gray-400">○</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Analisando...</span>
        </div>
      )}
    </div>
  );
}
