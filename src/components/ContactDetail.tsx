import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Edit, Trash2, Save, X, Phone, Mail, Building2, 
  MapPin, Globe, Linkedin, Calendar, User, TrendingUp, 
  AlertTriangle, CheckCircle, Clock, Target
} from 'lucide-react';
import { Contact, ContactFormData, EstadoHistorial } from '../types/contact';
import { Company } from '../types/company';
import { useContacts } from '../hooks/useContacts';
import { useCompanies } from '../hooks/useCompanies';

interface ContactDetailProps {
  contact: Contact;
  onBack: () => void;
  onContactUpdated: (contact: Contact) => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact, onBack, onContactUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    nombre: contact.nombre,
    email: contact.email,
    telefono: contact.telefono,
    empresa: contact.empresa,
    empresaId: contact.empresaId,
    cargo: contact.cargo || '',
    estado: contact.estado,
    origen: contact.origen,
    interes: contact.interes,
    probabilidadConversion: contact.probabilidadConversion,
    valorEstimado: contact.valorEstimado,
    direccion: contact.direccion || '',
    ciudad: contact.ciudad || '',
    pais: contact.pais || '',
    sitioWeb: contact.sitioWeb || '',
    linkedin: contact.linkedin || '',
    notas: contact.notas || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { updateContact, deleteContact, markAsNoPotencial } = useContacts();
  const { companies, linkContactToCompany, unlinkContactFromCompany } = useCompanies();

  const handleSave = async () => {
    if (!formData.nombre || !formData.email) {
      setError('Nombre y email son obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updatedContact = await updateContact(contact.id, formData);
      
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
      
      onContactUpdated(updatedContact);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteContact(contact.id);
      onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar contacto');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNoPotencial = async () => {
    const action = contact.isNoPotencial ? 'reactivar' : 'marcar como No Potencial';
    if (!window.confirm(`¿Estás seguro de que deseas ${action} este contacto?`)) {
      return;
    }

    setLoading(true);
    try {
      await markAsNoPotencial(contact.id, !contact.isNoPotencial);
      // Actualizar el contacto local
      const updatedContact = { ...contact, isNoPotencial: !contact.isNoPotencial };
      onContactUpdated(updatedContact);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEstadoColor = (estado: string) => {
    const colors = {
      'Primer contacto': 'bg-blue-100 text-blue-800',
      'Segundo contacto': 'bg-yellow-100 text-yellow-800',
      'Propuesta': 'bg-purple-100 text-purple-800',
      'Cerrado': 'bg-green-100 text-green-800',
      'No Potencial': 'bg-red-100 text-red-800'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getInteresColor = (interes: string) => {
    const colors = {
      'Alto': 'text-green-600',
      'Medio': 'text-yellow-600',
      'Bajo': 'text-red-600'
    };
    return colors[interes as keyof typeof colors] || 'text-gray-600';
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
            <span>Volver a Contactos</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          {contact.isNoPotencial ? (
            <button
              onClick={handleToggleNoPotencial}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={16} />
              <span>Reactivar</span>
            </button>
          ) : (
            <button
              onClick={handleToggleNoPotencial}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <AlertTriangle size={16} />
              <span>No Potencial</span>
            </button>
          )}
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

      {/* Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Básica</h2>
            
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 font-semibold">
                      {contact.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{contact.nombre}</h3>
                    {contact.cargo && <p className="text-gray-600">{contact.cargo}</p>}
                  </div>
                  {contact.isNoPotencial && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                      No Potencial
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail size={16} />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone size={16} />
                    <span>{contact.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Building2 size={16} />
                    <span>{contact.empresa}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sales Info Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de Ventas</h2>
            
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interés</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad (%)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.valorEstimado}
                    onChange={(e) => setFormData({ ...formData, valorEstimado: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estado</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(contact.estado)}`}>
                    {contact.estado}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Score</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(contact.score)}`}>
                    {contact.score}/5
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Interés</p>
                  <span className={`font-medium ${getInteresColor(contact.interes)}`}>
                    {contact.interes}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Probabilidad</p>
                  <span className="font-medium text-gray-800">{contact.probabilidadConversion}%</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Origen</p>
                  <span className="text-gray-800">{contact.origen}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Valor Estimado</p>
                  <span className="font-medium text-green-600">${contact.valorEstimado.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Location & Web Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ubicación y Web</h2>
            
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <input
                    type="text"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                  <input
                    type="url"
                    value={formData.sitioWeb}
                    onChange={(e) => setFormData({ ...formData, sitioWeb: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {contact.ciudad && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{contact.ciudad}{contact.pais && `, ${contact.pais}`}</span>
                  </div>
                )}
                {contact.sitioWeb && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Globe size={16} />
                    <a href={contact.sitioWeb} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {contact.sitioWeb}
                    </a>
                  </div>
                )}
                {contact.linkedin && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Linkedin size={16} />
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notas</h2>
            {isEditing ? (
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Notas sobre el contacto..."
              />
            ) : (
              <div className="min-h-[100px] p-3 bg-gray-50 rounded-lg">
                {contact.notas ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{contact.notas}</p>
                ) : (
                  <p className="text-gray-500 italic">Sin notas</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Creado</span>
                <span className="text-sm text-gray-800">
                  {new Date(contact.fechaCreacion).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Actualizado</span>
                <span className="text-sm text-gray-800">
                  {new Date(contact.fechaActualizacion).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Propietario</span>
                <span className="text-sm text-gray-800">{contact.usuarioPropietario}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Empresa Vinculada</h3>
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <select
                  value={formData.empresaId || ''}
                  onChange={(e) => setFormData({ ...formData, empresaId: e.target.value, empresa: companies.find(c => c.id === e.target.value)?.nombre || '' })}
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
            ) : (
              <div>
                {contact.empresaId ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{contact.empresa}</p>
                      <p className="text-sm text-gray-600">Empresa vinculada</p>
                    </div>
                    <button
                      onClick={() => {
                        const company = companies.find(c => c.id === contact.empresaId);
                        if (company) {
                          // Aquí podrías navegar a la empresa
                          console.log('Navegar a empresa:', company);
                        }
                      }}
                      className="text-teal-600 hover:text-teal-700 transition-colors text-sm"
                    >
                      Ver empresa →
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sin empresa vinculada</p>
                )}
              </div>
            )}
          </div>

          {/* Estado History */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Historial de Estados</h3>
            <div className="space-y-3">
              {contact.historialEstados.length > 0 ? (
                contact.historialEstados.slice(-5).reverse().map((historial, index) => (
                  <div key={historial.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        {historial.estadoAnterior ? 
                          `${historial.estadoAnterior} → ${historial.estadoNuevo}` : 
                          historial.estadoNuevo
                        }
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(historial.fecha).toLocaleDateString()} - {historial.usuario}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Sin historial de cambios</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;