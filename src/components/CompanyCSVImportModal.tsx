import React, { useState, useRef } from 'react';
import { X, Upload, Download, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useCompanies } from '../hooks/useCompanies';

interface CompanyCSVImportModalProps {
  onClose: () => void;
  onImportComplete: () => void;
}

const CompanyCSVImportModal: React.FC<CompanyCSVImportModalProps> = ({ onClose, onImportComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { importFromCSV } = useCompanies();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert('Por favor selecciona un archivo CSV válido');
      return;
    }
    setFile(selectedFile);
    setResults(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvContent = e.target?.result as string;
        try {
          const importResults = await importFromCSV(csvContent);
          setResults(importResults);
          if (importResults.success > 0) {
            onImportComplete();
          }
        } catch (err) {
          setResults({
            success: 0,
            errors: [err instanceof Error ? err.message : 'Error desconocido']
          });
        } finally {
          setImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setResults({
        success: 0,
        errors: ['Error al leer el archivo']
      });
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `Nombre,Nombre Comercial,Sector,Tamaño,Email,Teléfono,Sitio Web,Ciudad,Estado,País,Dirección,Descripción
"Restaurante Ejemplo S.A.","Restaurante Ejemplo","Restaurante","Pequeña (1-10)","info@ejemplo.com","(555) 123-4567","https://ejemplo.com","San José","San José","Costa Rica","Calle 1, Avenida 2","Restaurante especializado en comida típica"
"Tech Solutions LLC","Tech Solutions","Tecnología","Mediana (11-50)","contact@techsolutions.com","(555) 987-6543","https://techsolutions.com","Miami","Florida","Estados Unidos","123 Tech Street","Empresa de desarrollo de software"`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_empresas.csv';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Importar Empresas desde CSV</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Instrucciones</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• El archivo debe estar en formato CSV con codificación UTF-8</li>
              <li>• La primera fila debe contener los encabezados de columna</li>
              <li>• El campo obligatorio es: Nombre</li>
              <li>• Se detectarán y reportarán duplicados por nombre</li>
              <li>• Máximo 500 filas por importación</li>
            </ul>
          </div>

          {/* Template Download */}
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              <span>Descargar Plantilla CSV</span>
            </button>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-teal-500 bg-teal-50'
                : file
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            {file ? (
              <div className="space-y-2">
                <FileText className="mx-auto h-12 w-12 text-green-500" />
                <p className="text-green-700 font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remover archivo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-gray-600">
                  Arrastra tu archivo CSV aquí o{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    selecciona un archivo
                  </button>
                </p>
                <p className="text-sm text-gray-500">Solo archivos CSV (máx. 10MB)</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                handleFileSelect(selectedFile);
              }
            }}
            className="hidden"
          />

          {/* Results */}
          {results && (
            <div className="mt-6 p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                {results.success > 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <h4 className="font-medium text-gray-800">Resultados de Importación</h4>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-green-600">{results.success}</span> empresas importadas exitosamente
                </p>
                
                {results.errors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-2">
                      {results.errors.length} errores encontrados:
                    </p>
                    <div className="max-h-32 overflow-y-auto bg-red-50 p-2 rounded text-xs">
                      {results.errors.map((error, index) => (
                        <p key={index} className="text-red-700">{error}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {results ? 'Cerrar' : 'Cancelar'}
            </button>
            {file && !results && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                <Upload size={16} />
                <span>{importing ? 'Importando...' : 'Importar Empresas'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCSVImportModal;