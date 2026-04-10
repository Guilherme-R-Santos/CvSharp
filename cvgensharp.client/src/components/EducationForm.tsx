import React from 'react';
import type { Education } from '@/types/cv';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface EducationFormProps {
  educations: Education[];
  onAdd: () => void;
  onUpdate: (education: Education) => void;
  onDelete: (id: string) => void;
}

export function EducationForm({ educations, onAdd, onUpdate, onDelete }: EducationFormProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(
    educations.length > 0 ? educations[0].id : null
  );

  const handleChange = (id: string, field: keyof Education, value: string) => {
    const education = educations.find((e) => e.id === id);
    if (education) {
      onUpdate({ ...education, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Educação
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Educação
        </button>
      </div>

      <div className="space-y-4">
        {educations.map((education) => (
          <div
            key={education.id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedId(expandedId === education.id ? null : education.id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {education.degree || 'Nova Educação'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {education.school}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(education.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {expandedId === education.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {expandedId === education.id && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instituição *
                    </label>
                    <input
                      type="text"
                      value={education.school}
                      onChange={(e) =>
                        handleChange(education.id, 'school', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Nome da universidade ou escola"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grau *
                    </label>
                    <select
                      value={education.degree}
                      onChange={(e) =>
                        handleChange(education.id, 'degree', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Selecione um grau</option>
                      <option value="Ensino Médio">Ensino Médio</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Bacharel">Bacharel</option>
                      <option value="Licenciatura">Licenciatura</option>
                      <option value="Mestrado">Mestrado</option>
                      <option value="Doutorado">Doutorado</option>
                      <option value="Pós-Doutorado">Pós-Doutorado</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Área/Campo *
                    </label>
                    <input
                      type="text"
                      value={education.field}
                      onChange={(e) =>
                        handleChange(education.id, 'field', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Ex: Ciência da Computação"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descrição (Opcional)
                    </label>
                    <textarea
                      value={education.description || ''}
                      onChange={(e) =>
                        handleChange(education.id, 'description', e.target.value)
                      }
                      placeholder="Principais projetos, honras, atividades..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Início *
                    </label>
                    <input
                      type="month"
                      value={education.startDate}
                      onChange={(e) =>
                        handleChange(education.id, 'startDate', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Conclusão *
                    </label>
                    <input
                      type="month"
                      value={education.endDate}
                      onChange={(e) =>
                        handleChange(education.id, 'endDate', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {educations.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma educação adicionada. Clique em "Adicionar Educação" para começar.
          </p>
        </div>
      )}
    </div>
  );
}
