import type { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, ExternalLink, Briefcase, Book, Award } from 'lucide-react';

interface CVPreviewProps {
  cvData: CVData;
}

export function CVPreview({ cvData }: CVPreviewProps) {
  const { personalInfo, education, experience, skills, projects, certificates } = cvData;

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-sky-500">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {personalInfo.fullName || 'Seu Nome'}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${personalInfo.email}`} className="hover:text-sky-500">
                {personalInfo.email}
              </a>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {personalInfo.location}
            </div>
          )}
        </div>

        {personalInfo.linkedinUrl || personalInfo.portfolioUrl ? (
          <div className="flex gap-3 text-sm">
            {personalInfo.linkedinUrl && (
              <a
                href={personalInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
              >
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {personalInfo.portfolioUrl && (
              <a
                href={personalInfo.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:text-sky-600 flex items-center gap-1"
              >
                Portfólio <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ) : null}
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Resumo Profissional</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
            <Briefcase className="w-5 h-5" />
            Experiência Profissional
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="ml-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {exp.position}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                    {exp.currentlyWorking && <span className="text-green-600 dark:text-green-400"> • Atual</span>}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exp.company}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{exp.description}</p>
                {exp.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
            <Book className="w-5 h-5" />
            Educação
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="ml-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {edu.degree} em {edu.field}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school}</p>
                {edu.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Habilidades</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-900 dark:text-sky-200 rounded-full text-sm font-medium"
              >
                {skill.name}
                <span className="text-xs opacity-75">
                  ({skill.level === 'beginner' ? 'I' : skill.level === 'intermediate' ? 'II' : skill.level === 'advanced' ? 'III' : 'IV'})
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Projetos</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="ml-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-500 hover:text-sky-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Tecnologias:</strong> {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
            <Award className="w-5 h-5" />
            Certificações
          </h2>
          <div className="space-y-2">
            {certificates.map((cert) => (
              <div key={cert.id} className="ml-4 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{cert.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {cert.issueDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
