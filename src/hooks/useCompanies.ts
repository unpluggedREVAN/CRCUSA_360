import { useState, useEffect } from 'react';
import { Company, CompanyFormData, CompanyFilters } from '../types/company';
import { useAuth } from '../contexts/AuthContext';

// Mock data storage - en producción sería una API/base de datos
const STORAGE_KEY = 'crcusa_companies';

const initialCompanies: Company[] = [
  {
    id: '1',
    nombre: 'Land & Ocean Costa Rican Restaurant',
    nombreComercial: 'Land & Ocean',
    sector: 'Restaurante',
    tamaño: 'Pequeña (1-10)',
    sitioWeb: 'https://landocean.com',
    ciudad: 'Milwaukee',
    estado: 'Wisconsin',
    pais: 'Estados Unidos',
    direccion: '1532 N Farwell Ave, Milwaukee, WI 53202',
    telefono: '(920) 626-3063',
    email: 'info@landocean.com',
    descripcion: 'Restaurante especializado en comida costarricense auténtica',
    fechaCreacion: '2024-01-15T10:30:00Z',
    fechaActualizacion: '2024-01-15T10:30:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    contactosVinculados: ['1'], // Luis Bolaños
    mapLink: 'https://maps.google.com/?q=1532+N+Farwell+Ave,+Milwaukee,+WI+53202'
  },
  {
    id: '2',
    nombre: 'Tacanes Restaurant LLC',
    nombreComercial: 'Tacanes Restaurant',
    sector: 'Restaurante',
    tamaño: 'Pequeña (1-10)',
    ciudad: 'Newark',
    estado: 'New Jersey',
    pais: 'Estados Unidos',
    telefono: '(973) 787-4200',
    email: 'info@tacanes.com',
    descripcion: 'Restaurante familiar con especialidades costarricenses',
    fechaCreacion: '2024-01-16T14:20:00Z',
    fechaActualizacion: '2024-01-16T14:20:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    contactosVinculados: ['2'], // Jorge Arturo Barahona
  },
  {
    id: '3',
    nombre: 'Pollo Tico Inc',
    nombreComercial: 'Pollo Tico',
    sector: 'Restaurante',
    tamaño: 'Mediana (11-50)',
    sitioWeb: 'https://pollotico.com',
    ciudad: 'Denver',
    estado: 'Colorado',
    pais: 'Estados Unidos',
    telefono: '(720) 343-7757',
    email: 'info@pollotico.com',
    descripcion: 'Cadena de restaurantes de pollo al estilo costarricense',
    fechaCreacion: '2024-01-17T09:15:00Z',
    fechaActualizacion: '2024-01-17T09:15:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    contactosVinculados: ['3'], // Byron Gómez
  },
  {
    id: '4',
    nombre: 'Qué Rica Restaurant Corp',
    nombreComercial: 'Qué Rica Restaurant',
    sector: 'Restaurante',
    tamaño: 'Pequeña (1-10)',
    ciudad: 'Newark',
    estado: 'New Jersey',
    pais: 'Estados Unidos',
    telefono: '(973) 821-5958',
    email: 'info@querica.com',
    descripcion: 'Restaurante tradicional costarricense',
    fechaCreacion: '2024-01-18T16:45:00Z',
    fechaActualizacion: '2024-01-18T16:45:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    contactosVinculados: ['4'], // Dinier Villanueva
  },
  {
    id: '5',
    nombre: 'Iz Corners LLC',
    nombreComercial: 'Iz Corners',
    sector: 'Restaurante',
    tamaño: 'Pequeña (1-10)',
    ciudad: 'Nueva York',
    estado: 'New York',
    pais: 'Estados Unidos',
    telefono: '(646) 490-5460',
    email: 'info@izcorners.com',
    descripcion: 'Restaurante de comida latina con especialidades costarricenses',
    fechaCreacion: '2024-01-19T11:30:00Z',
    fechaActualizacion: '2024-01-19T11:30:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    contactosVinculados: ['5'], // Wally Corrales
  },
  {
    id: '6',
    nombre: 'Irazu Costa Rican Restaurant Inc',
    nombreComercial: 'Irazu Costa Rican Restaurant',
    sector: 'Restaurante',
    tamaño: 'Pequeña (1-10)',
    sitioWeb: 'https://irazu.com',
    ciudad: 'Chicago',
    estado: 'Illinois',
    pais: 'Estados Unidos',
    telefono: '(773) 252-5067',
    email: 'info@irazu.com',
    descripcion: 'Restaurante familiar con más de 30 años sirviendo comida costarricense auténtica',
    fechaCreacion: '2024-01-20T13:20:00Z',
    fechaActualizacion: '2024-01-20T13:20:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    contactosVinculados: ['6'], // Miriam Cerdas
  }
];

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Cargar empresas del localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompanies(JSON.parse(stored));
      } else {
        setCompanies(initialCompanies);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCompanies));
      }
    } catch (err) {
      console.error('Error loading companies:', err);
      setCompanies(initialCompanies);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar empresas en localStorage
  const saveCompanies = (newCompanies: Company[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCompanies));
      setCompanies(newCompanies);
    } catch (err) {
      console.error('Error saving companies:', err);
      setError('Error al guardar las empresas');
    }
  };

  // Crear empresa
  const createCompany = async (data: CompanyFormData): Promise<Company> => {
    try {
      const newCompany: Company = {
        id: Date.now().toString(),
        ...data,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        usuarioPropietario: user?.email || 'unknown',
        contactosVinculados: []
      };

      const updatedCompanies = [...companies, newCompany];
      saveCompanies(updatedCompanies);
      return newCompany;
    } catch (err) {
      setError('Error al crear la empresa');
      throw err;
    }
  };

  // Actualizar empresa
  const updateCompany = async (id: string, data: Partial<CompanyFormData>): Promise<Company> => {
    try {
      const companyIndex = companies.findIndex(c => c.id === id);
      if (companyIndex === -1) {
        throw new Error('Empresa no encontrada');
      }

      const updatedCompany: Company = {
        ...companies[companyIndex],
        ...data,
        fechaActualizacion: new Date().toISOString(),
      };

      const updatedCompanies = [...companies];
      updatedCompanies[companyIndex] = updatedCompany;
      saveCompanies(updatedCompanies);
      return updatedCompany;
    } catch (err) {
      setError('Error al actualizar la empresa');
      throw err;
    }
  };

  // Eliminar empresa
  const deleteCompany = async (id: string): Promise<void> => {
    try {
      const updatedCompanies = companies.filter(c => c.id !== id);
      saveCompanies(updatedCompanies);
    } catch (err) {
      setError('Error al eliminar la empresa');
      throw err;
    }
  };

  // Vincular contacto a empresa
  const linkContactToCompany = async (companyId: string, contactId: string): Promise<void> => {
    try {
      const companyIndex = companies.findIndex(c => c.id === companyId);
      if (companyIndex === -1) {
        return; // Si no existe la empresa, no hacer nada
      }

      const company = companies[companyIndex];
      if (!company.contactosVinculados.includes(contactId)) {
        const updatedCompany = {
          ...company,
          contactosVinculados: [...company.contactosVinculados, contactId],
          fechaActualizacion: new Date().toISOString()
        };

        const updatedCompanies = [...companies];
        updatedCompanies[companyIndex] = updatedCompany;
        saveCompanies(updatedCompanies);
      }
    } catch (err) {
      console.error('Error al vincular contacto:', err);
    }
  };

  // Desvincular contacto de empresa
  const unlinkContactFromCompany = async (companyId: string, contactId: string): Promise<void> => {
    try {
      const companyIndex = companies.findIndex(c => c.id === companyId);
      if (companyIndex === -1) {
        return; // Si no existe la empresa, no hacer nada
      }

      const company = companies[companyIndex];
      const updatedCompany = {
        ...company,
        contactosVinculados: company.contactosVinculados.filter(id => id !== contactId),
        fechaActualizacion: new Date().toISOString()
      };

      const updatedCompanies = [...companies];
      updatedCompanies[companyIndex] = updatedCompany;
      saveCompanies(updatedCompanies);
    } catch (err) {
      console.error('Error al desvincular contacto:', err);
    }
  };

  // Filtrar empresas
  const filterCompanies = (filters: CompanyFilters): Company[] => {
    return companies.filter(company => {
      // Filtro de búsqueda
      if (filters.busqueda) {
        const searchTerm = filters.busqueda.toLowerCase();
        const matchesSearch = 
          company.nombre.toLowerCase().includes(searchTerm) ||
          (company.nombreComercial && company.nombreComercial.toLowerCase().includes(searchTerm)) ||
          (company.email && company.email.toLowerCase().includes(searchTerm)) ||
          (company.telefono && company.telefono.includes(searchTerm));
        if (!matchesSearch) return false;
      }

      // Filtro de sector
      if (filters.sector !== 'todos' && company.sector !== filters.sector) {
        return false;
      }

      // Filtro de tamaño
      if (filters.tamaño !== 'todos' && company.tamaño !== filters.tamaño) {
        return false;
      }

      // Filtro de ciudad
      if (filters.ciudad !== 'todos' && company.ciudad !== filters.ciudad) {
        return false;
      }

      // Filtro de país
      if (filters.pais !== 'todos' && company.pais !== filters.pais) {
        return false;
      }

      return true;
    });
  };

  // Exportar a CSV
  const exportToCSV = (filteredCompanies: Company[]): string => {
    const headers = [
      'ID', 'Nombre', 'Nombre Comercial', 'Sector', 'Tamaño', 'Email', 'Teléfono',
      'Sitio Web', 'Ciudad', 'Estado', 'País', 'Dirección', 'Contactos Vinculados',
      'Fecha Creación', 'Usuario Propietario'
    ];

    const rows = filteredCompanies.map(company => [
      company.id,
      company.nombre,
      company.nombreComercial || '',
      company.sector,
      company.tamaño,
      company.email || '',
      company.telefono || '',
      company.sitioWeb || '',
      company.ciudad || '',
      company.estado || '',
      company.pais || '',
      company.direccion || '',
      company.contactosVinculados.length.toString(),
      new Date(company.fechaCreacion).toLocaleDateString(),
      company.usuarioPropietario
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  };

  // Importar desde CSV
  const importFromCSV = async (csvContent: string): Promise<{ success: number; errors: string[] }> => {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        throw new Error('El archivo CSV debe contener al menos una fila de datos');
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      const dataLines = lines.slice(1);

      let successCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < dataLines.length; i++) {
        try {
          const values = dataLines[i].split(',').map(v => v.replace(/"/g, '').trim());
          
          // Mapear valores a campos de la empresa
          const companyData: CompanyFormData = {
            nombre: values[headers.indexOf('Nombre')] || '',
            nombreComercial: values[headers.indexOf('Nombre Comercial')] || undefined,
            sector: values[headers.indexOf('Sector')] || 'Otro',
            tamaño: (values[headers.indexOf('Tamaño')] as Company['tamaño']) || 'Pequeña (1-10)',
            email: values[headers.indexOf('Email')] || undefined,
            telefono: values[headers.indexOf('Teléfono')] || values[headers.indexOf('Telefono')] || undefined,
            sitioWeb: values[headers.indexOf('Sitio Web')] || undefined,
            ciudad: values[headers.indexOf('Ciudad')] || undefined,
            estado: values[headers.indexOf('Estado')] || undefined,
            pais: values[headers.indexOf('País')] || undefined,
            direccion: values[headers.indexOf('Dirección')] || undefined,
            descripcion: values[headers.indexOf('Descripción')] || undefined,
          };

          // Validaciones básicas
          if (!companyData.nombre) {
            errors.push(`Fila ${i + 2}: Nombre es obligatorio`);
            continue;
          }

          // Verificar duplicados por nombre
          const existingCompany = companies.find(c => 
            c.nombre.toLowerCase() === companyData.nombre.toLowerCase()
          );
          if (existingCompany) {
            errors.push(`Fila ${i + 2}: Ya existe una empresa con el nombre ${companyData.nombre}`);
            continue;
          }

          await createCompany(companyData);
          successCount++;
        } catch (err) {
          errors.push(`Fila ${i + 2}: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        }
      }

      return { success: successCount, errors };
    } catch (err) {
      throw new Error(`Error al procesar CSV: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  return {
    companies,
    loading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    linkContactToCompany,
    unlinkContactFromCompany,
    filterCompanies,
    exportToCSV,
    importFromCSV,
    clearError: () => setError(null)
  };
};