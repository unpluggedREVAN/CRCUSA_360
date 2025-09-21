import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Filter, Building2, MapPin, Users, Search, Eye, Phone, Mail, Globe } from 'lucide-react';
import { Company, CompanyFilters } from '../types/company';
import { Contact } from '../types/contact';
import { useCompanies } from '../hooks/useCompanies';
import { useContacts } from '../hooks/useContacts';
import CompanyDetail from './CompanyDetail';
import CompanyForm from './CompanyForm';
import CompanyCSVImportModal from './CompanyCSVImportModal';

const Empresas: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [filters, setFilters] = useState<CompanyFilters>({
    busqueda: '',
    sector: 'todos',
    tamaño: 'todos',
    ciudad: 'todos',
    pais: 'todos'
  });

  const { companies, loading, filterCompanies, exportToCSV } = useCompanies();
  const { contacts } = useContacts();
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filtered = filterCompanies(filters);
    setFilteredCompanies(filtered);
  }, [companies, filters, filterCompanies]);

  // Obtener contactos vinculados a una empresa
  const getLinkedContacts = (company: Company): Contact[] => {
    return contacts.filter(contact => company.contactosVinculados.includes(contact.id));
  };

  const handleExportCSV = () => {
    const csvContent = exportToCSV(filteredCompanies);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `empresas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleCompanySaved = () => {
    // Las empresas se actualizarán automáticamente a través del hook
    setShowCompanyForm(false);
    setEditingCompany(null);
  };

  const handleCompanyUpdated = (updatedCompany: Company) => {
    // Las empresas se actualizarán automáticamente a través del hook
    setSelectedCompany(updatedCompany);
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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando empresas...</p>
        </div>
      </div>
    );
  }

  // Si hay una empresa seleccionada, mostrar vista de detalle
  if (selectedCompany) {
    return (
      <CompanyDetail
        company={selectedCompany}
        onBack={() => setSelectedCompany(null)}
        onCompanyUpdated={handleCompanyUpdated}
      />
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Empresas</h1>
          <p className="text-gray-600">Gestiona tu base de datos de empresas.</p>
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
            onClick={() => setShowCompanyForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={16} />
            <span>Añadir Nueva Empresa</span>
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
                  placeholder="Buscar empresas..."
                  value={filters.busqueda}
                  onChange={(e) => setFilters({ ...filters, busqueda: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="todos">Todos los sectores</option>
                <option value="Restaurante">Restaurante</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Comercio">Comercio</option>
                <option value="Servicios">Servicios</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <select
                value={filters.tamaño}
                onChange={(e) => setFilters({ ...filters, tamaño: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="todos">Todos los tamaños</option>
                <option value="Pequeña (1-10)">Pequeña (1-10)</option>
                <option value="Mediana (11-50)">Mediana (11-50)</option>
                <option value="Grande (50+)">Grande (50+)</option>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <select
                  value={filters.ciudad}
                  onChange={(e) => setFilters({ ...filters, ciudad: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="todos">Todas las ciudades</option>
                  {Array.from(new Set(companies.map(c => c.ciudad).filter(Boolean))).map(ciudad => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <select
                  value={filters.pais}
                  onChange={(e) => setFilters({ ...filters, pais: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="todos">Todos los países</option>
                  {Array.from(new Set(companies.map(c => c.pais).filter(Boolean))).map(pais => (
                    <option key={pais} value={pais}>{pais}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Empresas</p>
          <p className="text-2xl font-bold text-gray-800">{companies.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Filtradas</p>
          <p className="text-2xl font-bold text-teal-600">{filteredCompanies.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Restaurantes</p>
          <p className="text-2xl font-bold text-orange-600">
            {companies.filter(c => c.sector === 'Restaurante').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Con Contactos</p>
          <p className="text-2xl font-bold text-green-600">
            {companies.filter(c => c.contactosVinculados.length > 0).length}
          </p>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => {
          const linkedContacts = getLinkedContacts(company);
          return (
            <div key={company.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Building2 className="text-teal-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{company.nombre}</h3>
                    {company.nombreComercial && (
                      <p className="text-sm text-gray-600">"{company.nombreComercial}"</p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSectorColor(company.sector)}`}>
                        {company.sector}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTamañoColor(company.tamaño)}`}>
                        {company.tamaño}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCompany(company)}
                  className="text-gray-400 hover:text-teal-600 transition-colors"
                >
                  <Eye size={16} />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {company.telefono && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone size={14} />
                    <span className="text-sm">{company.telefono}</span>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail size={14} />
                    <span className="text-sm">{company.email}</span>
                  </div>
                )}
                {company.sitioWeb && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Globe size={14} />
                    <a href={company.sitioWeb} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      Sitio Web
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={14} />
                  <span className="text-sm">
                    {[company.ciudad, company.estado, company.pais].filter(Boolean).join(', ') || 'Ubicación no especificada'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {linkedContacts.length} contacto{linkedContacts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {linkedContacts.length > 0 && (
                    <div className="flex -space-x-2">
                      {linkedContacts.slice(0, 3).map((contact, index) => (
                        <div
                          key={contact.id}
                          className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-xs font-medium text-teal-600 border-2 border-white"
                          title={contact.nombre}
                        >
                          {contact.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                      ))}
                      {linkedContacts.length > 3 && (
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                          +{linkedContacts.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <Building2 size={96} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {companies.length === 0 ? 'No hay empresas' : 'No se encontraron empresas'}
          </h3>
          <p className="text-gray-500 mb-4">
            {companies.length === 0 
              ? 'Añade la primera empresa para comenzar.' 
              : 'Intenta ajustar los filtros de búsqueda.'
            }
          </p>
          {companies.length === 0 && (
            <button 
              onClick={() => setShowCompanyForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus size={16} />
              <span>Añadir Primera Empresa</span>
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showCompanyForm && (
        <CompanyForm
          company={editingCompany || undefined}
          onClose={() => {
            setShowCompanyForm(false);
            setEditingCompany(null);
          }}
          onCompanySaved={handleCompanySaved}
        />
      )}

      {showImportModal && (
        <CompanyCSVImportModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={() => {
            setShowImportModal(false);
            // Las empresas se actualizarán automáticamente
          }}
        />
      )}
    </div>
  );
};

export default Empresas;