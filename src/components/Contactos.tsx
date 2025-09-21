import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Filter, Phone, MapPin, Star, DollarSign, Search, Eye } from 'lucide-react';
import { Contact, ContactFilters } from '../types/contact';
import { useContacts } from '../hooks/useContacts';
import ContactDetail from './ContactDetail';
import ContactForm from './ContactForm';
import CSVImportModal from './CSVImportModal';

const Contactos: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState<ContactFilters>({
    busqueda: '',
    estado: 'todos',
    origen: 'todos',
    interes: 'todos',
    scoreMin: 1,
    scoreMax: 5,
    probabilidadMin: 0,
    probabilidadMax: 100,
    noPotenciales: false
  });

  const { contacts, loading, filterContacts, exportToCSV } = useContacts();
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filtered = filterContacts(filters);
    setFilteredContacts(filtered);
  }, [contacts, filters, filterContacts]);

  const handleExportCSV = () => {
    const csvContent = exportToCSV(filteredContacts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contactos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleContactSaved = () => {
    // Los contactos se actualizarán automáticamente a través del hook
    setShowContactForm(false);
    setEditingContact(null);
  };

  const handleContactUpdated = (updatedContact: Contact) => {
    // Los contactos se actualizarán automáticamente a través del hook
    setSelectedContact(updatedContact);
  };

  const getInitials = (nombre: string) => {
    return nombre.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contactos...</p>
        </div>
      </div>
    );
  }

  // Si hay un contacto seleccionado, mostrar vista de detalle
  if (selectedContact) {
    return (
      <ContactDetail
        contact={selectedContact}
        onBack={() => setSelectedContact(null)}
        onContactUpdated={handleContactUpdated}
      />
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Contactos</h1>
          <p className="text-gray-600">Gestiona tu base de datos de contactos.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload size={16} />
            <span>Importar CSV</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>
          <button 
            onClick={() => setShowContactForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={16} />
            <span>Añadir Nuevo Contacto</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
        <div className="space-y-4">
          {/* Basic Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar contactos..."
                  value={filters.busqueda}
                  onChange={(e) => setFilters({ ...filters, busqueda: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="Primer contacto">Primer contacto</option>
                <option value="Segundo contacto">Segundo contacto</option>
                <option value="Propuesta">Propuesta</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </div>
            <div>
              <select
                value={filters.origen}
                onChange={(e) => setFilters({ ...filters, origen: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="todos">Todos los orígenes</option>
                <option value="Web">Web</option>
                <option value="Referido">Referido</option>
                <option value="Evento">Evento</option>
                <option value="Cold Call">Cold Call</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email">Email</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              <span>Más Filtros</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interés</label>
                <select
                  value={filters.interes}
                  onChange={(e) => setFilters({ ...filters, interes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="todos">Todos</option>
                  <option value="Alto">Alto</option>
                  <option value="Medio">Medio</option>
                  <option value="Bajo">Bajo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score Mínimo</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={filters.scoreMin}
                  onChange={(e) => setFilters({ ...filters, scoreMin: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad Mín (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.probabilidadMin}
                  onChange={(e) => setFilters({ ...filters, probabilidadMin: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.noPotenciales}
                    onChange={(e) => setFilters({ ...filters, noPotenciales: e.target.checked })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Incluir No Potenciales</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Contactos</p>
          <p className="text-2xl font-bold text-gray-800">{contacts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Filtrados</p>
          <p className="text-2xl font-bold text-teal-600">{filteredContacts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Primer Contacto</p>
          <p className="text-2xl font-bold text-blue-600">
            {contacts.filter(c => c.estado === 'Primer contacto').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Cerrados</p>
          <p className="text-2xl font-bold text-green-600">
            {contacts.filter(c => c.estado === 'Cerrado').length}
          </p>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-semibold text-sm">
                    {getInitials(contact.nombre)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{contact.nombre}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(contact.estado)}`}>
                      {contact.estado}
                    </span>
                    {contact.isNoPotencial && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                        No Potencial
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedContact(contact)}
                className="text-gray-400 hover:text-teal-600 transition-colors"
              >
                <Eye size={16} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone size={14} />
                <span className="text-sm">{contact.telefono}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin size={14} />
                <span className="text-sm">{contact.empresa}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Star size={14} />
                <span className={`text-sm px-2 py-1 rounded-full ${getScoreColor(contact.score)}`}>
                  Score: {contact.score}/5
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">Valor estimado:</span>
                  <span className="ml-1 font-semibold">${contact.valorEstimado.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-green-600 font-medium">{contact.probabilidadConversion}% prob.</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {contacts.length === 0 ? 'No hay contactos' : 'No se encontraron contactos'}
          </h3>
          <p className="text-gray-500 mb-4">
            {contacts.length === 0 
              ? 'Añade el primer contacto para comenzar.' 
              : 'Intenta ajustar los filtros de búsqueda.'
            }
          </p>
          {contacts.length === 0 && (
            <button 
              onClick={() => setShowContactForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus size={16} />
              <span>Añadir Primer Contacto</span>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showContactForm && (
        <ContactForm
          contact={editingContact || undefined}
          onClose={() => {
            setShowContactForm(false);
            setEditingContact(null);
          }}
          onContactSaved={handleContactSaved}
        />
      )}

      {showImportModal && (
        <CSVImportModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={() => {
            setShowImportModal(false);
            // Los contactos se actualizarán automáticamente
          }}
        />
      )}
    </div>
  );
};

export default Contactos;