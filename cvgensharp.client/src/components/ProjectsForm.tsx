import React from 'react';
import type { Project } from '@/types/cv';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectsFormProps {
  projects: Project[];
  onAdd: () => void;
  onUpdate: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectsForm({ projects, onAdd, onUpdate, onDelete }: ProjectsFormProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  const handleChange = (id: string, field: keyof Project, value: any) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      onUpdate({ ...project, [field]: value });
    }
  };

  const handleTechChange = (id: string, index: number, value: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      const newTechs = [...project.technologies];
      newTechs[index] = value;
      onUpdate({ ...project, technologies: newTechs });
    }
  };

  const addTech = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      onUpdate({ ...project, technologies: [...project.technologies, ''] });
    }
  };

  const removeTech = (id: string, index: number) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      const newTechs = project.technologies.filter((_, i) => i !== index);
      onUpdate({ ...project, technologies: newTechs });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projetos
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Projeto
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedId(expandedId === project.id ? null : project.id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {project.name || 'Novo Projeto'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                  {project.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {expandedId === project.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {expandedId === project.id && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) =>
                      handleChange(project.id, 'name', e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                    placeholder="Nome do projeto"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      handleChange(project.id, 'description', e.target.value)
                    }
                    placeholder="Descreva o projeto e seu impacto"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL do Projeto (Opcional)
                  </label>
                  <input
                    type="url"
                    value={project.url || ''}
                    onChange={(e) => handleChange(project.id, 'url', e.target.value)}
                    placeholder="https://github.com/seu-projeto"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tecnologias Utilizadas
                    </label>
                    <button
                      onClick={() => addTech(project.id)}
                      className="text-sm text-sky-500 hover:text-sky-600 font-medium"
                    >
                      + Adicionar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {project.technologies.map((tech, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) =>
                            handleTechChange(project.id, index, e.target.value)
                          }
                          placeholder={`Tecnologia ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                        />
                        <button
                          onClick={() => removeTech(project.id, index)}
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

      {projects.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum projeto adicionado. Clique em "Adicionar Projeto" para começar.
          </p>
        </div>
      )}
    </div>
  );
}
