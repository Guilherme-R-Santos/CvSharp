import React from 'react';
import type { Experience } from '@/types/cv';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface ExperienceFormProps {
  experiences: Experience[];
  onAdd: () => void;
  onUpdate: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export function ExperienceForm({ experiences, onAdd, onUpdate, onDelete }: ExperienceFormProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(
    experiences.length > 0 ? experiences[0].id : null
  );

  const handleChange = (id: string, field: keyof Experience, value: any) => {
    const experience = experiences.find((e) => e.id === id);
    if (experience) {
      onUpdate({ ...experience, [field]: value });
    }
  };

  const handleHighlightChange = (id: string, index: number, value: string) => {
    const experience = experiences.find((e) => e.id === id);
    if (experience) {
      const newHighlights = [...experience.highlights];
      newHighlights[index] = value;
      onUpdate({ ...experience, highlights: newHighlights });
    }
  };

  const addHighlight = (id: string) => {
    const experience = experiences.find((e) => e.id === id);
    if (experience) {
      onUpdate({ ...experience, highlights: [...experience.highlights, ''] });
    }
  };

  const removeHighlight = (id: string, index: number) => {
    const experience = experiences.find((e) => e.id === id);
    if (experience) {
      const newHighlights = experience.highlights.filter((_, i) => i !== index);
      onUpdate({ ...experience, highlights: newHighlights });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Experiência Profissional
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Experiência
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedId(expandedId === experience.id ? null : experience.id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {experience.position || 'Nova Experiência'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {experience.company}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(experience.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {expandedId === experience.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {expandedId === experience.id && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) =>
                        handleChange(experience.id, 'company', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Nome da empresa"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cargo *
                    </label>
                    <input
                      type="text"
                      value={experience.position}
                      onChange={(e) =>
                        handleChange(experience.id, 'position', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Seu cargo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Início *
                    </label>
                    <input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) =>
                        handleChange(experience.id, 'startDate', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Término
                    </label>
                    <input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) =>
                        handleChange(experience.id, 'endDate', e.target.value)
                      }
                      disabled={experience.currentlyWorking}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={experience.currentlyWorking}
                      onChange={(e) =>
                        handleChange(
                          experience.id,
                          'currentlyWorking',
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Atualmente trabalho aqui
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição do Cargo *
                  </label>
                  <textarea
                    value={experience.description}
                    onChange={(e) =>
                      handleChange(experience.id, 'description', e.target.value)
                    }
                    placeholder="Descreva suas responsabilidades principais"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white resize-none"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Destaques de Realizações
                    </label>
                    <button
                      onClick={() => addHighlight(experience.id)}
                      className="text-sm text-sky-500 hover:text-sky-600 font-medium"
                    >
                      + Adicionar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {experience.highlights.map((highlight, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) =>
                            handleHighlightChange(
                              experience.id,
                              index,
                              e.target.value
                            )
                          }
                          placeholder={`Realização ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => removeHighlight(experience.id, index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {experiences.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma experiência adicionada. Clique em "Adicionar Experiência" para começar.
          </p>
        </div>
      )}
    </div>
  );
}
