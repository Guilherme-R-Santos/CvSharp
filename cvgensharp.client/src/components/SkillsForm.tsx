import type { Skill } from '@/types/cv';
import { Trash2, Plus } from 'lucide-react';

interface SkillsFormProps {
  skills: Skill[];
  onAdd: () => void;
  onUpdate: (skill: Skill) => void;
  onDelete: (id: string) => void;
}

export function SkillsForm({ skills, onAdd, onUpdate, onDelete }: SkillsFormProps) {
  const handleChange = (id: string, field: keyof Skill, value: string) => {
    const skill = skills.find((s) => s.id === id);
    if (skill) {
      onUpdate({ ...skill, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Habilidades
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Habilidade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleChange(skill.id, 'name', e.target.value)}
                placeholder="Nome da habilidade"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white text-sm"
              />
              <button
                onClick={() => onDelete(skill.id)}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nível de Proficiência
              </label>
              <select
                value={skill.level}
                onChange={(e) =>
                  handleChange(skill.id, 'level', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white text-sm"
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
                <option value="expert">Especialista</option>
              </select>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-300"
                  style={{
                    width:
                      skill.level === 'beginner'
                        ? '25%'
                        : skill.level === 'intermediate'
                          ? '50%'
                          : skill.level === 'advanced'
                            ? '75%'
                            : '100%',
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12">
                {skill.level === 'beginner'
                  ? '25%'
                  : skill.level === 'intermediate'
                    ? '50%'
                    : skill.level === 'advanced'
                      ? '75%'
                      : '100%'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma habilidade adicionada. Clique em "Adicionar Habilidade" para começar.
          </p>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 <strong>Dica:</strong> Adicione habilidades técnicas e comportamentais que sejam relevantes para o cargo desejado. Sistemas ATS costumam procurar por palavras-chave específicas.
        </p>
      </div>
    </div>
  );
}
