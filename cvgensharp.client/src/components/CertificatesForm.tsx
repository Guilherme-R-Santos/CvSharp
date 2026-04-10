import React from 'react';
import type { Certificate } from '@/types/cv';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface CertificatesFormProps {
  certificates: Certificate[];
  onAdd: () => void;
  onUpdate: (certificate: Certificate) => void;
  onDelete: (id: string) => void;
}

export function CertificatesForm({
  certificates,
  onAdd,
  onUpdate,
  onDelete,
}: CertificatesFormProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(
    certificates.length > 0 ? certificates[0].id : null
  );

  const handleChange = (id: string, field: keyof Certificate, value: string) => {
    const certificate = certificates.find((c) => c.id === id);
    if (certificate) {
      onUpdate({ ...certificate, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Certificações
        </h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Certificação
        </button>
      </div>

      <div className="space-y-4">
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedId(
                  expandedId === certificate.id ? null : certificate.id
                )
              }
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {certificate.name || 'Nova Certificação'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {certificate.issuer}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(certificate.id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {expandedId === certificate.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {expandedId === certificate.id && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome da Certificação *
                    </label>
                    <input
                      type="text"
                      value={certificate.name}
                      onChange={(e) =>
                        handleChange(certificate.id, 'name', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Ex: AWS Solutions Architect"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Órgão Emissor *
                    </label>
                    <input
                      type="text"
                      value={certificate.issuer}
                      onChange={(e) =>
                        handleChange(certificate.id, 'issuer', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Ex: Amazon Web Services"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Emissão *
                    </label>
                    <input
                      type="month"
                      value={certificate.issueDate}
                      onChange={(e) =>
                        handleChange(certificate.id, 'issueDate', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Data de Expiração
                    </label>
                    <input
                      type="month"
                      value={certificate.expirationDate || ''}
                      onChange={(e) =>
                        handleChange(
                          certificate.id,
                          'expirationDate',
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Deixe em branco se não expira"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL da Credencial
                  </label>
                  <input
                    type="url"
                    value={certificate.credentialUrl || ''}
                    onChange={(e) =>
                      handleChange(certificate.id, 'credentialUrl', e.target.value)
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma certificação adicionada. Clique em "Adicionar Certificação" para começar.
          </p>
        </div>
      )}
    </div>
  );
}
