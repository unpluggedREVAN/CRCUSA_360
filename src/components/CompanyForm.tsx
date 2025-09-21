import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { CompanyFormData, Company } from '../types/company';
import { useCompanies } from '../hooks/useCompanies';

interface CompanyFormProps {
  company?: Company;
  onClose: () => void;
  onCompanySaved: (company: Company) => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onClose, onCompanySaved }) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    nombre: company?.nombre || '',
    nombreComercial: company?.nombreComercial || '',
    sector: company?.sector || 'Restaurante',
    tamaño: company?.tamaño || 'Pequeña (1-10)',
    sitioWeb: company?.sitioWeb || '',
    ciudad: company?.ciudad || '',
    estado: company?.estado || '',
    pais: company?.pais || '',
    direccion: company?.direccion || '',
    telefono: company?.telefono || '',
    email: company?.email || '',
    descripcion: company?.descripcion || '',
    mapLink: company?.mapLink || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { createCompany, updateCompany } = useCompanies();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre) {
      setError('Nombre es obligatorio');
      return;
    }

    // Validar formato de email si se proporciona
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Formato de email inválido');
        return;
      }
    }

    // Validar formato de URL si se proporciona
    if (formData.sitioWeb) {
      try {
        new URL(formData.sitioWeb);
      } catch {
        setError('Formato de sitio web inválido');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      let savedCompany: Company;
      
      if (company) {
        // Actualizar empresa existente
        savedCompany = await updateCompany(company.id, formData);
      } else {
        // Crear nueva empresa
        savedCompany = await createCompany(formData);
      }

      onCompanySaved(savedCompany);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {company ? 'Editar Empresa' : 'Nueva Empresa'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información Básica */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Información Básica</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Legal *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Comercial
              </label>
              <input
                type="text"
                value={formData.nombreComercial}
                onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Nombre con el que se conoce comercialmente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sector
              </label>
              <select
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Restaurante">Restaurante</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Comercio">Comercio</option>
                <option value="Servicios">Servicios</option>
                <option value="Manufactura">Manufactura</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Turismo">Turismo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamaño de Empresa
              </label>
              <select
                value={formData.tamaño}
                onChange={(e) => setFormData({ ...formData, tamaño: e.target.value as Company['tamaño'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Pequeña (1-10)">Pequeña (1-10 empleados)</option>
                <option value="Mediana (11-50)">Mediana (11-50 empleados)</option>
                <option value="Grande (50+)">Grande (50+ empleados)</option>
              </select>
            </div>

            {/* Información de Contacto */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Información de Contacto</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="contacto@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web
              </label>
              <input
                type="url"
                value={formData.sitioWeb}
                onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="https://www.empresa.com"
              />
            </div>

            {/* Ubicación */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Ubicación</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado/Provincia
              </label>
              <input
                type="text"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <input
                type="text"
                value={formData.pais}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enlace de Mapa
              </label>
              <input
                type="url"
                value={formData.mapLink}
                onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección Completa
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Calle, número, código postal"
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2 mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Descripción de la empresa, servicios que ofrece, etc."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              <span>{loading ? 'Guardando...' : 'Guardar Empresa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;