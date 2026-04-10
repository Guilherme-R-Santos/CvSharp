import { useState } from 'react';
import type { CVData } from '@/types/cv';
import { PersonalInfoForm } from '@/components/PersonalInfoForm';
import { ExperienceForm } from '@/components/ExperienceForm';
import { EducationForm } from '@/components/EducationForm';
import { SkillsForm } from '@/components/SkillsForm';
import { ProjectsForm } from '@/components/ProjectsForm';
import { CertificatesForm } from '@/components/CertificatesForm';
import { CVPreview } from '@/components/CVPreview';
import { Download, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certificates: [],
};

export function CVGenerator() {
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [activeTab, setActiveTab] = useState<
    'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certificates' | 'preview'
  >('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleGenerateCV = async () => {
    setIsGenerating(true);
    setGenerationComplete(false);
    
    try {
      if (!cvData.personalInfo.fullName?.trim() || !cvData.personalInfo.email?.trim()) {
        alert('Nome completo e email são obrigatórios para gerar o currículo.');
        return;
      }

      const response = await fetch('/api/cv/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData,
          optimizationSettings: {
            format: 'pdf',
            includePhotography: false,
            useKeywords: true,
          },
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      let rawText = '';

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        rawText = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
          rawText ||
          `Erro ao gerar currículo (HTTP ${response.status})`
        );
      }
      
      if (data.fileUrl) {
        const link = document.createElement('a');
        link.href = data.fileUrl;
        link.download = data.fileName || 'curriculo.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setGenerationComplete(true);
        setTimeout(() => setGenerationComplete(false), 3000);
      } else {
        throw new Error(data?.message || 'Não foi possível gerar o arquivo do currículo.');
      }
    } catch (error) {
      console.error('Erro:', error);
      const message = error instanceof Error ? error.message : 'Erro ao gerar currículo. Tente novamente.';
      alert(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Informações Pessoais', icon: '👤' },
    { id: 'experience', label: 'Experiência', icon: '💼' },
    { id: 'education', label: 'Educação', icon: '🎓' },
    { id: 'skills', label: 'Habilidades', icon: '⭐' },
    { id: 'projects', label: 'Projetos', icon: '📁' },
    { id: 'certificates', label: 'Certificações', icon: '🏆' },
    { id: 'preview', label: 'Prévia', icon: '👁️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Gerador de Currículo ATS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crie um currículo otimizado para sistemas de rastreamento de candidatos (ATS)
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          {activeTab === 'personal' && (
            <PersonalInfoForm
              data={cvData.personalInfo}
              onChange={(personalInfo) => setCvData({ ...cvData, personalInfo })}
            />
          )}

          {activeTab === 'experience' && (
            <ExperienceForm
              experiences={cvData.experience}
              onAdd={() =>
                setCvData({
                  ...cvData,
                  experience: [
                    ...cvData.experience,
                    {
                      id: generateId(),
                      company: '',
                      position: '',
                      startDate: '',
                      endDate: '',
                      currentlyWorking: false,
                      description: '',
                      highlights: [],
                    },
                  ],
                })
              }
              onUpdate={(experience) =>
                setCvData({
                  ...cvData,
                  experience: cvData.experience.map((e) =>
                    e.id === experience.id ? experience : e
                  ),
                })
              }
              onDelete={(id) =>
                setCvData({
                  ...cvData,
                  experience: cvData.experience.filter((e) => e.id !== id),
                })
              }
            />
          )}

          {activeTab === 'education' && (
            <EducationForm
              educations={cvData.education}
              onAdd={() =>
                setCvData({
                  ...cvData,
                  education: [
                    ...cvData.education,
                    {
                      id: generateId(),
                      school: '',
                      degree: '',
                      field: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                    },
                  ],
                })
              }
              onUpdate={(education) =>
                setCvData({
                  ...cvData,
                  education: cvData.education.map((e) =>
                    e.id === education.id ? education : e
                  ),
                })
              }
              onDelete={(id) =>
                setCvData({
                  ...cvData,
                  education: cvData.education.filter((e) => e.id !== id),
                })
              }
            />
          )}

          {activeTab === 'skills' && (
            <SkillsForm
              skills={cvData.skills}
              onAdd={() =>
                setCvData({
                  ...cvData,
                  skills: [
                    ...cvData.skills,
                    {
                      id: generateId(),
                      name: '',
                      level: 'intermediate',
                    },
                  ],
                })
              }
              onUpdate={(skill) =>
                setCvData({
                  ...cvData,
                  skills: cvData.skills.map((s) =>
                    s.id === skill.id ? skill : s
                  ),
                })
              }
              onDelete={(id) =>
                setCvData({
                  ...cvData,
                  skills: cvData.skills.filter((s) => s.id !== id),
                })
              }
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsForm
              projects={cvData.projects}
              onAdd={() =>
                setCvData({
                  ...cvData,
                  projects: [
                    ...cvData.projects,
                    {
                      id: generateId(),
                      name: '',
                      description: '',
                      technologies: [],
                    },
                  ],
                })
              }
              onUpdate={(project) =>
                setCvData({
                  ...cvData,
                  projects: cvData.projects.map((p) =>
                    p.id === project.id ? project : p
                  ),
                })
              }
              onDelete={(id) =>
                setCvData({
                  ...cvData,
                  projects: cvData.projects.filter((p) => p.id !== id),
                })
              }
            />
          )}

          {activeTab === 'certificates' && (
            <CertificatesForm
              certificates={cvData.certificates}
              onAdd={() =>
                setCvData({
                  ...cvData,
                  certificates: [
                    ...cvData.certificates,
                    {
                      id: generateId(),
                      name: '',
                      issuer: '',
                      issueDate: '',
                    },
                  ],
                })
              }
              onUpdate={(certificate) =>
                setCvData({
                  ...cvData,
                  certificates: cvData.certificates.map((c) =>
                    c.id === certificate.id ? certificate : c
                  ),
                })
              }
              onDelete={(id) =>
                setCvData({
                  ...cvData,
                  certificates: cvData.certificates.filter((c) => c.id !== id),
                })
              }
            />
          )}

          {activeTab === 'preview' && (
            <CVPreview cvData={cvData} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-5 h-5" />
                Ocultar Prévia
              </>
            ) : (
              <>
                <Eye className="w-5 h-5" />
                Ver Prévia
              </>
            )}
          </button>

          <button
            onClick={handleGenerateCV}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Gerando...
              </>
            ) : generationComplete ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Currículo Gerado!
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Gerar e Baixar CV (PDF)
              </>
            )}
          </button>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="mt-8 max-h-96 overflow-y-auto bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <CVPreview cvData={cvData} />
          </div>
        )}
      </div>
    </div>
  );
}
