import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { ContactFormData, Contact } from '../types/contact';
import { useCompanies } from '../hooks/useCompanies';
import { useContacts } from '../hooks/useContacts';

interface ContactFormProps {
  contact?: Contact;
  onClose: () => void;
  onContactSaved: (contact: Contact) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onClose, onContactSaved }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    nombre: contact?.nombre || '',
    email: contact?.email || '',
    telefono: contact?.telefono || '',
    empresa: contact?.empresa || '',
    empresaId: contact?.empresaId || '',
    cargo: contact?.cargo || '',
    estado: contact?.estado || 'Primer contacto',
    origen: contact?.origen || 'Web',
    interes: contact?.interes || 'Medio',
    probabilidadConversion: contact?.probabilidadConversion || 50,
    valorEstimado: contact?.valorEstimado || 0,
    direccion: contact?.direccion || '',
    ciudad: contact?.ciudad || '',
    pais: contact?.pais || '',
    sitioWeb: contact?.sitioWeb || '',
    linkedin: contact?.linkedin || '',
    notas: contact?.notas || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { createContact, updateContact } = useContacts();
  const { companies, linkContactToCompany, unlinkContactFromCompany } = useCompanies();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email) {
      setError('Nombre y email son obligatorios');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Formato de email inválido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let savedContact: Contact;
      
      if (contact) {
        // Actualizar contacto existente
        savedContact = await updateContact(contact.id, formData);
        
        // Manejar vinculación/desvinculación de empresa
        if (formData.empresaId !== contact.empresaId) {
          // Desvincular de empresa anterior si existe
          if (contact.empresaId) {
            await unlinkContactFromCompany(contact.empresaId, contact.id);
          }
          
          // Vincular a nueva empresa si se seleccionó una
          if (formData.empresaId) {
            await linkContactToCompany(formData.empresaId, contact.id);
          }
        }
      } else {
        // Crear nuevo contacto
        savedContact = await createContact(formData);
        
        // Vincular a empresa si se seleccionó una
        if (formData.empresaId) {
          await linkContactToCompany(formData.empresaId, savedContact.id);
        }
      }

      onContactSaved(savedContact);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar contacto');
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
            {contact ? 'Editar Contacto' : 'Nuevo Contacto'}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa Vinculada
              </label>
              <select
                value={formData.empresaId || ''}
                onChange={(e) => {
                  const selectedCompany = companies.find(c => c.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    empresaId: e.target.value,
                    empresa: selectedCompany?.nombre || ''
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Sin empresa vinculada</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa (Texto libre)
              </label>
              <input
                type="text"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Nombre de empresa si no está en la lista"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo
              </label>
              <input
                type="text"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Información de Ventas */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Información de Ventas</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as Contact['estado'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Primer contacto">Primer contacto</option>
                <option value="Segundo contacto">Segundo contacto</option>
                <option value="Propuesta">Propuesta</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origen
              </label>
              <select
                value={formData.origen}
                onChange={(e) => setFormData({ ...formData, origen: e.target.value as Contact['origen'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Web">Web</option>
                <option value="Referido">Referido</option>
                <option value="Evento">Evento</option>
                <option value="Cold Call">Cold Call</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email">Email</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Interés
              </label>
              <select
                value={formData.interes}
                onChange={(e) => setFormData({ ...formData, interes: e.target.value as Contact['interes'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Alto">Alto</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Probabilidad de Conversión (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.probabilidadConversion}
                onChange={(e) => setFormData({ ...formData, probabilidadConversion: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Estimado ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.valorEstimado}
                onChange={(e) => setFormData({ ...formData, valorEstimado: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Ubicación y Web */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Ubicación y Web</h3>
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
                Sitio Web
              </label>
              <input
                type="url"
                value={formData.sitioWeb}
                onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="https://ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="https://linkedin.com/in/usuario"
              />
            </div>

            {/* Notas */}
            <div className="md:col-span-2 mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Notas adicionales sobre el contacto..."
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
              <span>{loading ? 'Guardando...' : 'Guardar Contacto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;