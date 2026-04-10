import type { PersonalInfo } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Informações Pessoais
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Seu nome completo"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Localização *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={data.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Cidade, Estado"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LinkedIn
          </label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="url"
              value={data.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/seu-perfil"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Portfólio / Website
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="url"
              value={data.portfolioUrl || ''}
              onChange={(e) => handleChange('portfolioUrl', e.target.value)}
              placeholder="https://seu-portfolio.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Resumo Profissional *
        </label>
        <textarea
          value={data.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Breve resumo sobre você, experiência e objetivos profissionais"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white resize-none"
          required
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Use palavras-chave relevantes para melhor compatibilidade com sistemas ATS
        </p>
      </div>
    </div>
  );
}
