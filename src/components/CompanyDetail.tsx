import React, { useState } from 'react';
import { 
  ArrowLeft, Edit, Trash2, Save, X, Phone, Mail, Building2, 
  MapPin, Globe, Calendar, User, Users, Link, Unlink, Plus
} from 'lucide-react';
import { Company, CompanyFormData } from '../types/company';
import { Contact } from '../types/contact';
import { useCompanies } from '../hooks/useCompanies';
import { useContacts } from '../hooks/useContacts';

interface CompanyDetailProps {
  company: Company;
  onBack: () => void;
  onCompanyUpdated: (company: Company) => void;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company, onBack, onCompanyUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    nombre: company.nombre,
    nombreComercial: company.nombreComercial || '',
    sector: company.sector,
    tamaño: company.tamaño,
    sitioWeb: company.sitioWeb || '',
    ciudad: company.ciudad || '',
    estado: company.estado || '',
    pais: company.pais || '',
    direccion: company.direccion || '',
    telefono: company.telefono || '',
    email: company.email || '',
    descripcion: company.descripcion || '',
    mapLink: company.mapLink || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { updateCompany, deleteCompany, linkContactToCompany, unlinkContactFromCompany } = useCompanies();
  const { contacts } = useContacts();

  // Obtener contactos vinculados
  const linkedContacts = contacts.filter(contact => 
    company.contactosVinculados.includes(contact.id)
  );

  // Obtener contactos disponibles para vincular
  const availableContacts = contacts.filter(contact => 
    !company.contactosVinculados.includes(contact.id)
  );

  const handleSave = async () => {
    if (!formData.nombre) {
      setError('Nombre es obligatorio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedCompany = await updateCompany(company.id, formData);
      onCompanyUpdated(updatedCompany);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteCompany(company.id);
      onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkContact = async (contactId: string) => {
    try {
      await linkContactToCompany(company.id, contactId);
      // Actualizar la empresa local
      const updatedCompany = {
        ...company,
        contactosVinculados: [...company.contactosVinculados, contactId]
      };
      onCompanyUpdated(updatedCompany);
      setShowLinkModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al vincular contacto');
    }
  };

  const handleUnlinkContact = async (contactId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas desvincular este contacto?')) {
      return;
    }

    try {
      await unlinkContactFromCompany(company.id, contactId);
      // Actualizar la empresa local
      const updatedCompany = {
        ...company,
        contactosVinculados: company.contactosVinculados.filter(id => id !== contactId)
      };
      onCompanyUpdated(updatedCompany);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desvincular contacto');
    }
  };

  const getSectorColor = (sector: string) => {
    const colors = {
      'Restaurante': 'bg-orange-100 text-orange-800',
      'Tecnología': 'bg-blue-100 text-blue-800',
      'Comercio': 'bg-green-100 text-green-800',
      'Servicios': 'bg-purple-100 text-purple-800',
      'Otro': 'bg-gray-100 text-gray-800'
    };
    return colors[sector as keyof typeof colors] || colors.Otro;
  };

  const getTamañoColor = (tamaño: string) => {
    const colors = {
      'Pequeña (1-10)': 'bg-yellow-100 text-yellow-800',
      'Mediana (11-50)': 'bg-blue-100 text-blue-800',
      'Grande (50+)': 'bg-green-100 text-green-800'
    };
    return colors[tamaño as keyof typeof colors] || colors['Pequeña (1-10)'];
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a Empresas</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={16} />
                <span>Editar</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                <span>Guardar</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Básica</h2>
            
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Legal *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial</label>
                  <input
                    type="text"
                    value={formData.nombreComercial}
                    onChange={(e) => setFormData({ ...formData, nombreComercial: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Restaurante">Restaurante</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Comercio">Comercio</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                  <select
                    value={formData.tamaño}
                    onChange={(e) => setFormData({ ...formData, tamaño: e.target.value as Company['tamaño'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Pequeña (1-10)">Pequeña (1-10)</option>
                    <option value="Mediana (11-50)">Mediana (11-50)</option>
                    <option value="Grande (50+)">Grande (50+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                  <input
                    type="url"
                    value={formData.sitioWeb}
                    onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://ejemplo.com"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Building2 className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{company.nombre}</h3>
                    {company.nombreComercial && (
                      <p className="text-gray-600">"{company.nombreComercial}"</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.email && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Mail size={16} />
                      <span>{company.email}</span>
                    </div>
                  )}
                  {company.telefono && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone size={16} />
                      <span>{company.telefono}</span>
                    </div>
                  )}
                  {company.sitioWeb && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Globe size={16} />
                      <a href={company.sitioWeb} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {company.sitioWeb}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSectorColor(company.sector)}`}>
                    {company.sector}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTamañoColor(company.tamaño)}`}>
                    {company.tamaño}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ubicación</h2>
            
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <input
                    type="text"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <input
                    type="text"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enlace de Mapa</label>
                  <input
                    type="url"
                    value={formData.mapLink}
                    onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {(company.ciudad || company.estado || company.pais) && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin size={16} />
                    <span>
                      {[company.ciudad, company.estado, company.pais].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                {company.direccion && (
                  <div className="flex items-start space-x-2 text-gray-600">
                    <Building2 size={16} className="mt-0.5" />
                    <span>{company.direccion}</span>
                  </div>
                )}
                {company.mapLink && (
                  <div className="mt-4">
                    <a
                      href={company.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MapPin size={16} />
                      <span>Ver en Mapa</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Descripción</h2>
            {isEditing ? (
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Descripción de la empresa..."
              />
            ) : (
              <p className="text-gray-600">
                {company.descripcion || 'Sin descripción disponible'}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Contactos</span>
                <span className="text-lg font-semibold text-teal-600">
                  {company.contactosVinculados.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Creada</span>
                <span className="text-sm text-gray-800">
                  {new Date(company.fechaCreacion).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Actualizada</span>
                <span className="text-sm text-gray-800">
                  {new Date(company.fechaActualizacion).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Propietario</span>
                <span className="text-sm text-gray-800">{company.usuarioPropietario}</span>
              </div>
            </div>
          </div>

          {/* Linked Contacts */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Contactos Vinculados</h3>
              <button
                onClick={() => setShowLinkModal(true)}
                className="flex items-center space-x-1 px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
              >
                <Plus size={14} />
                <span>Vincular</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {linkedContacts.length > 0 ? (
                linkedContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{contact.nombre}</p>
                      <p className="text-sm text-gray-600">{contact.cargo || 'Sin cargo'}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                    <button
                      onClick={() => handleUnlinkContact(contact.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Desvincular contacto"
                    >
                      <Unlink size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No hay contactos vinculados</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Link Contact Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Vincular Contacto</h2>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {availableContacts.length > 0 ? (
                <div className="space-y-3">
                  {availableContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-800">{contact.nombre}</p>
                        <p className="text-sm text-gray-600">{contact.empresa}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                      <button
                        onClick={() => handleLinkContact(contact.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                      >
                        <Link size={14} />
                        <span>Vincular</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay contactos disponibles para vincular
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;