import { useState, useEffect } from 'react';
import { Contact, ContactFormData, ContactFilters, EstadoHistorial } from '../types/contact';
import { useAuth } from '../contexts/AuthContext';

// Mock data storage - en producción sería una API/base de datos
const STORAGE_KEY = 'crcusa_contacts';

const initialContacts: Contact[] = [
  {
    id: '1',
    nombre: 'Luis Bolaños',
    email: 'luis@landocean.com',
    telefono: '(920) 626-3063',
    empresa: 'Land & Ocean Costa Rican Restaurant',
    cargo: 'Propietario',
    estado: 'Primer contacto',
    score: 3,
    origen: 'Web',
    interes: 'Medio',
    probabilidadConversion: 50,
    valorEstimado: 0,
    fechaCreacion: '2024-01-15T10:30:00Z',
    fechaActualizacion: '2024-01-15T10:30:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    ciudad: 'Milwaukee',
    pais: 'Estados Unidos',
    empresaId: '1',
    isNoPotencial: false,
    historialEstados: []
  },
  {
    id: '2',
    nombre: 'Jorge Arturo Barahona',
    email: 'jorge@tacanes.com',
    telefono: '(973) 787-4200',
    empresa: 'Tacanes Restaurant',
    cargo: 'Co-propietario',
    estado: 'Primer contacto',
    score: 3,
    origen: 'Referido',
    interes: 'Medio',
    probabilidadConversion: 50,
    valorEstimado: 0,
    fechaCreacion: '2024-01-16T14:20:00Z',
    fechaActualizacion: '2024-01-16T14:20:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    ciudad: 'Newark',
    pais: 'Estados Unidos',
    isNoPotencial: false,
    historialEstados: []
  },
  {
    id: '3',
    nombre: 'Byron Gómez',
    email: 'byron@pollotico.com',
    telefono: '(720) 343-7757',
    empresa: 'Pollo Tico',
    cargo: 'Gerente General',
    estado: 'Primer contacto',
    score: 3,
    origen: 'Evento',
    interes: 'Medio',
    probabilidadConversion: 50,
    valorEstimado: 0,
    fechaCreacion: '2024-01-17T09:15:00Z',
    fechaActualizacion: '2024-01-17T09:15:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    ciudad: 'Denver',
    pais: 'Estados Unidos',
    isNoPotencial: false,
    historialEstados: []
  },
  {
    id: '4',
    nombre: 'Dinier Villanueva',
    email: 'dinier@querica.com',
    telefono: '(973) 821-5958',
    empresa: 'Qué Rica Restaurant',
    cargo: 'Propietario',
    estado: 'Primer contacto',
    score: 3,
    origen: 'Cold Call',
    interes: 'Medio',
    probabilidadConversion: 50,
    valorEstimado: 0,
    fechaCreacion: '2024-01-18T16:45:00Z',
    fechaActualizacion: '2024-01-18T16:45:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    ciudad: 'Newark',
    pais: 'Estados Unidos',
    isNoPotencial: false,
    historialEstados: []
  },
  {
    id: '5',
    nombre: 'Wally Corrales',
    email: 'wally@izcorners.com',
    telefono: '(646) 490-5460',
    empresa: 'Iz Corners',
    cargo: 'Propietario',
    estado: 'Primer contacto',
    score: 3,
    origen: 'LinkedIn',
    interes: 'Medio',
    probabilidadConversion: 50,
    valorEstimado: 0,
    fechaCreacion: '2024-01-19T11:30:00Z',
    fechaActualizacion: '2024-01-19T11:30:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    ciudad: 'Nueva York',
    pais: 'Estados Unidos',
    isNoPotencial: false,
    historialEstados: []
  },
  {
    id: '6',
    nombre: 'Miriam Cerdas',
    email: 'miriam@irazu.com',
    telefono: '(773) 252-5067',
    empresa: 'Irazu Costa Rican Restaurant',
    cargo: 'Co-propietaria',
    estado: 'Primer contacto',
    score: 3,
    origen: 'Email',
    interes: 'Medio',
    probabilidadConversion: 50,
    valorEstimado: 0,
    fechaCreacion: '2024-01-20T13:20:00Z',
    fechaActualizacion: '2024-01-20T13:20:00Z',
    usuarioPropietario: 'admin@crcusa.com',
    ciudad: 'Chicago',
    pais: 'Estados Unidos',
    empresaId: '6',
    isNoPotencial: false,
    historialEstados: []
  }
];

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Cargar contactos del localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setContacts(JSON.parse(stored));
      } else {
        setContacts(initialContacts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContacts));
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
      setContacts(initialContacts);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar contactos en localStorage
  const saveContacts = (newContacts: Contact[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
      setContacts(newContacts);
    } catch (err) {
      console.error('Error saving contacts:', err);
      setError('Error al guardar los contactos');
    }
  };

  // Crear contacto
  const createContact = async (data: ContactFormData): Promise<Contact> => {
    try {
      const newContact: Contact = {
        id: Date.now().toString(),
        ...data,
        empresaId: data.empresaId,
        score: 3, // Score inicial por defecto
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        usuarioPropietario: user?.email || 'unknown',
        isNoPotencial: false,
        historialEstados: [{
          id: Date.now().toString(),
          estadoAnterior: '',
          estadoNuevo: data.estado,
          fecha: new Date().toISOString(),
          usuario: user?.email || 'unknown',
          comentario: 'Contacto creado'
        }]
      };

      const updatedContacts = [...contacts, newContact];
      saveContacts(updatedContacts);
      return newContact;
    } catch (err) {
      setError('Error al crear el contacto');
      throw err;
    }
  };

  // Actualizar contacto
  const updateContact = async (id: string, data: Partial<ContactFormData>): Promise<Contact> => {
    try {
      const contactIndex = contacts.findIndex(c => c.id === id);
      if (contactIndex === -1) {
        throw new Error('Contacto no encontrado');
      }

      const currentContact = contacts[contactIndex];
      const updatedContact: Contact = {
        ...currentContact,
        ...data,
        fechaActualizacion: new Date().toISOString(),
      };

      // Si cambió el estado, agregar al historial
      if (data.estado && data.estado !== currentContact.estado) {
        const historialEntry: EstadoHistorial = {
          id: Date.now().toString(),
          estadoAnterior: currentContact.estado,
          estadoNuevo: data.estado,
          fecha: new Date().toISOString(),
          usuario: user?.email || 'unknown'
        };
        updatedContact.historialEstados = [...currentContact.historialEstados, historialEntry];
      }

      // Si cambió la empresa, actualizar la referencia
      if (data.empresa !== currentContact.empresa || data.empresaId !== currentContact.empresaId) {
        updatedContact.empresa = data.empresa;
        updatedContact.empresaId = data.empresaId;
      }

      const updatedContacts = [...contacts];
      updatedContacts[contactIndex] = updatedContact;
      saveContacts(updatedContacts);
      return updatedContact;
    } catch (err) {
      setError('Error al actualizar el contacto');
      throw err;
    }
  };

  // Eliminar contacto
  const deleteContact = async (id: string): Promise<void> => {
    try {
      const updatedContacts = contacts.filter(c => c.id !== id);
      saveContacts(updatedContacts);
    } catch (err) {
      setError('Error al eliminar el contacto');
      throw err;
    }
  };

  // Marcar como No Potencial
  const markAsNoPotencial = async (id: string, isNoPotencial: boolean): Promise<void> => {
    try {
      await updateContact(id, { isNoPotencial } as any);
    } catch (err) {
      setError('Error al actualizar el estado');
      throw err;
    }
  };

  // Filtrar contactos
  const filterContacts = (filters: ContactFilters): Contact[] => {
    return contacts.filter(contact => {
      // Filtro de búsqueda
      if (filters.busqueda) {
        const searchTerm = filters.busqueda.toLowerCase();
        const matchesSearch = 
          contact.nombre.toLowerCase().includes(searchTerm) ||
          contact.empresa.toLowerCase().includes(searchTerm) ||
          contact.email.toLowerCase().includes(searchTerm) ||
          contact.telefono.includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Filtro de estado
      if (filters.estado !== 'todos' && contact.estado !== filters.estado) {
        return false;
      }

      // Filtro de origen
      if (filters.origen !== 'todos' && contact.origen !== filters.origen) {
        return false;
      }

      // Filtro de interés
      if (filters.interes !== 'todos' && contact.interes !== filters.interes) {
        return false;
      }

      // Filtro de score
      if (contact.score < filters.scoreMin || contact.score > filters.scoreMax) {
        return false;
      }

      // Filtro de probabilidad
      if (contact.probabilidadConversion < filters.probabilidadMin || 
          contact.probabilidadConversion > filters.probabilidadMax) {
        return false;
      }

      // Filtro de No Potenciales
      if (!filters.noPotenciales && contact.isNoPotencial) {
        return false;
      }

      return true;
    });
  };

  // Exportar a CSV
  const exportToCSV = (filteredContacts: Contact[]): string => {
    const headers = [
      'ID', 'Nombre', 'Email', 'Teléfono', 'Empresa', 'Cargo', 'Estado', 
      'Score', 'Origen', 'Interés', 'Probabilidad (%)', 'Valor Estimado',
      'Ciudad', 'País', 'Sitio Web', 'LinkedIn', 'Fecha Creación', 'Usuario Propietario'
    ];

    const rows = filteredContacts.map(contact => [
      contact.id,
      contact.nombre,
      contact.email,
      contact.telefono,
      contact.empresa,
      contact.cargo || '',
      contact.estado,
      contact.score.toString(),
      contact.origen,
      contact.interes,
      contact.probabilidadConversion.toString(),
      contact.valorEstimado.toString(),
      contact.ciudad || '',
      contact.pais || '',
      contact.sitioWeb || '',
      contact.linkedin || '',
      new Date(contact.fechaCreacion).toLocaleDateString(),
      contact.usuarioPropietario
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
          
          // Mapear valores a campos del contacto
          const contactData: ContactFormData = {
            nombre: values[headers.indexOf('Nombre')] || '',
            email: values[headers.indexOf('Email')] || '',
            telefono: values[headers.indexOf('Teléfono')] || values[headers.indexOf('Telefono')] || '',
            empresa: values[headers.indexOf('Empresa')] || '',
            cargo: values[headers.indexOf('Cargo')] || undefined,
            estado: (values[headers.indexOf('Estado')] as Contact['estado']) || 'Primer contacto',
            origen: (values[headers.indexOf('Origen')] as Contact['origen']) || 'Otro',
            interes: (values[headers.indexOf('Interés')] as Contact['interes']) || 'Medio',
            probabilidadConversion: parseInt(values[headers.indexOf('Probabilidad (%)')]) || 50,
            valorEstimado: parseFloat(values[headers.indexOf('Valor Estimado')]) || 0,
            ciudad: values[headers.indexOf('Ciudad')] || undefined,
            pais: values[headers.indexOf('País')] || undefined,
            sitioWeb: values[headers.indexOf('Sitio Web')] || undefined,
            linkedin: values[headers.indexOf('LinkedIn')] || undefined,
          };

          // Validaciones básicas
          if (!contactData.nombre || !contactData.email) {
            errors.push(`Fila ${i + 2}: Nombre y email son obligatorios`);
            continue;
          }

          // Verificar duplicados por email
          const existingContact = contacts.find(c => c.email === contactData.email);
          if (existingContact) {
            errors.push(`Fila ${i + 2}: Ya existe un contacto con el email ${contactData.email}`);
            continue;
          }

          await createContact(contactData);
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
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    markAsNoPotencial,
    filterContacts,
    exportToCSV,
    importFromCSV,
    clearError: () => setError(null)
  };
};