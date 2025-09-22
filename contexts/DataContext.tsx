'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  companyId?: string;
  role?: string;
  status: string;
  score: string;
  interest: string;
  probability: string;
  origin: string;
  estimatedValue: string;
  location: string;
  isPotential: boolean;
  createdAt: string;
  updatedAt: string;
  owner: string;
  initials: string;
}

export interface Company {
  id: string;
  name: string;
  tradeName: string;
  email: string;
  phone: string;
  website?: string;
  sector: string;
  size: string;
  location: string;
  address: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  initials: string;
}

interface DataContextType {
  contacts: Contact[];
  companies: Company[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  linkContactToCompany: (contactId: string, companyId: string) => void;
  unlinkContactFromCompany: (contactId: string) => void;
  getContactsByCompany: (companyId: string) => Contact[];
  importContactsFromCSV: (csvData: string) => { success: number; errors: string[] };
  importCompaniesFromCSV: (csvData: string) => { success: number; errors: string[] };
  exportContactsToCSV: () => string;
  exportCompaniesToCSV: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Luis Bolaños',
    email: 'luis@landocean.com',
    phone: '(920) 626-3063',
    company: 'Land & Ocean Costa Rican Restaurant',
    companyId: '1',
    role: 'Propietario',
    status: 'Cerrado',
    score: '3/5',
    interest: 'Alto',
    probability: '50%',
    origin: 'Web',
    estimatedValue: '$0',
    location: 'Milwaukee, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '21/9/2025',
    owner: 'admin@crcusa.com',
    initials: 'LB'
  },
  {
    id: '2',
    name: 'Jorge Arturo Barahona',
    email: 'jorge@tacanes.com',
    phone: '(973) 787-4200',
    company: 'Tacanes Restaurant',
    companyId: '2',
    role: 'Gerente',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Referencia',
    estimatedValue: '$0',
    location: 'Newark, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'JA'
  },
  {
    id: '3',
    name: 'Byron Gómez',
    email: 'byron@pollotico.com',
    phone: '(720) 343-7757',
    company: 'Pollo Tico',
    companyId: '3',
    role: 'Propietario',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Web',
    estimatedValue: '$0',
    location: 'Denver, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'BG'
  },
  {
    id: '4',
    name: 'Dinier Villanueva',
    email: 'dinier@querica.com',
    phone: '(973) 821-5958',
    company: 'Qué Rica Restaurant',
    companyId: '4',
    role: 'Chef',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Referencia',
    estimatedValue: '$0',
    location: 'Newark, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'DV'
  },
  {
    id: '5',
    name: 'Wally Corrales',
    email: 'wally@izcorners.com',
    phone: '(646) 490-5460',
    company: 'Iz Corners',
    companyId: '5',
    role: 'Propietario',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Web',
    estimatedValue: '$0',
    location: 'Nueva York, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'WC'
  },
  {
    id: '6',
    name: 'Miriam Cerdas',
    email: 'miriam@irazu.com',
    phone: '(773) 252-5067',
    company: 'Irazu Costa Rican Restaurant',
    companyId: '6',
    role: 'Gerente',
    status: 'Primer contacto',
    score: '3/5',
    interest: 'Medio',
    probability: '50%',
    origin: 'Referencia',
    estimatedValue: '$0',
    location: 'Chicago, Estados Unidos',
    isPotential: true,
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'MC'
  }
];

const initialCompanies: Company[] = [
  {
    id: '1',
    name: 'Land & Ocean Costa Rican Restaurant',
    tradeName: 'Land & Ocean',
    email: 'info@landocean.com',
    phone: '(920) 626-3063',
    website: 'https://landocean.com',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Milwaukee, Wisconsin, Estados Unidos',
    address: '1532 N Farwell Ave, Milwaukee, WI 53202',
    description: 'Restaurante especializado en comida costarricense auténtica',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'LO'
  },
  {
    id: '2',
    name: 'Tacanes Restaurant LLC',
    tradeName: 'Tacanes Restaurant',
    email: 'info@tacanes.com',
    phone: '(973) 787-4200',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Newark, New Jersey, Estados Unidos',
    address: '123 Main St, Newark, NJ 07102',
    description: 'Restaurante familiar con especialidades costarricenses',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'TR'
  },
  {
    id: '3',
    name: 'Pollo Tico Inc',
    tradeName: 'Pollo Tico',
    email: 'info@pollotico.com',
    phone: '(720) 343-7757',
    website: 'https://pollotico.com',
    sector: 'Restaurante',
    size: 'Mediana (11-50)',
    location: 'Denver, Colorado, Estados Unidos',
    address: '456 Denver Ave, Denver, CO 80202',
    description: 'Cadena de restaurantes especializados en pollo al estilo costarricense',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'PT'
  },
  {
    id: '4',
    name: 'Qué Rica Restaurant Corp',
    tradeName: 'Qué Rica Restaurant',
    email: 'info@querica.com',
    phone: '(973) 821-5958',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Newark, New Jersey, Estados Unidos',
    address: '789 Newark St, Newark, NJ 07103',
    description: 'Restaurante tradicional con ambiente familiar',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'QR'
  },
  {
    id: '5',
    name: 'Iz Corners LLC',
    tradeName: 'Iz Corners',
    email: 'info@izcorners.com',
    phone: '(646) 490-5460',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Nueva York, Estados Unidos',
    address: '321 NY Ave, New York, NY 10001',
    description: 'Restaurante boutique con fusión costarricense',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'IC'
  },
  {
    id: '6',
    name: 'Irazu Costa Rican Restaurant Inc',
    tradeName: 'Irazu Costa Rican Restaurant',
    email: 'info@irazu.com',
    phone: '(773) 252-5067',
    website: '',
    sector: 'Restaurante',
    size: 'Pequeña (1-10)',
    location: 'Chicago, Illinois, Estados Unidos',
    address: '654 Chicago Blvd, Chicago, IL 60601',
    description: 'Restaurante tradicional costarricense en el corazón de Chicago',
    createdAt: '15/1/2024',
    updatedAt: '15/1/2024',
    owner: 'admin@crcusa.com',
    initials: 'IR'
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('crcusa_contacts');
    const savedCompanies = localStorage.getItem('crcusa_companies');

    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      setContacts(initialContacts);
      localStorage.setItem('crcusa_contacts', JSON.stringify(initialContacts));
    }

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies));
    } else {
      setCompanies(initialCompanies);
      localStorage.setItem('crcusa_companies', JSON.stringify(initialCompanies));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('crcusa_contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem('crcusa_companies', JSON.stringify(companies));
    }
  }, [companies]);

  const generateInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => {
    const now = new Date().toLocaleDateString('es-ES');
    const newContact: Contact = {
      ...contactData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      initials: generateInitials(contactData.name)
    };
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (id: string, contactData: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id 
        ? { 
            ...contact, 
            ...contactData, 
            updatedAt: new Date().toLocaleDateString('es-ES'),
            initials: contactData.name ? generateInitials(contactData.name) : contact.initials
          }
        : contact
    ));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'initials'>) => {
    const now = new Date().toLocaleDateString('es-ES');
    const newCompany: Company = {
      ...companyData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      initials: generateInitials(companyData.name)
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: string, companyData: Partial<Company>) => {
    setCompanies(prev => prev.map(company => 
      company.id === id 
        ? { 
            ...company, 
            ...companyData, 
            updatedAt: new Date().toLocaleDateString('es-ES'),
            initials: companyData.name ? generateInitials(companyData.name) : company.initials
          }
        : company
    ));
  };

  const deleteCompany = (id: string) => {
    // Unlink all contacts from this company
    setContacts(prev => prev.map(contact => 
      contact.companyId === id 
        ? { ...contact, companyId: undefined, company: undefined }
        : contact
    ));
    setCompanies(prev => prev.filter(company => company.id !== id));
  };

  const linkContactToCompany = (contactId: string, companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, companyId, company: company.name, updatedAt: new Date().toLocaleDateString('es-ES') }
          : contact
      ));
    }
  };

  const unlinkContactFromCompany = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, companyId: undefined, company: undefined, updatedAt: new Date().toLocaleDateString('es-ES') }
        : contact
    ));
  };

  const getContactsByCompany = (companyId: string): Contact[] => {
    return contacts.filter(contact => contact.companyId === companyId);
  };

  const importContactsFromCSV = (csvData: string): { success: number; errors: string[] } => {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const errors: string[] = [];
    let success = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const contactData: any = {};

        headers.forEach((header, index) => {
          contactData[header] = values[index] || '';
        });

        if (!contactData.name || !contactData.email) {
          errors.push(`Línea ${i + 1}: Nombre y email son requeridos`);
          continue;
        }

        addContact({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || '',
          company: contactData.company || '',
          role: contactData.role || '',
          status: contactData.status || 'Primer contacto',
          score: contactData.score || '3/5',
          interest: contactData.interest || 'Medio',
          probability: contactData.probability || '50%',
          origin: contactData.origin || 'Importación',
          estimatedValue: contactData.estimatedValue || '$0',
          location: contactData.location || '',
          isPotential: contactData.isPotential === 'true' || contactData.isPotential === '1',
          owner: 'admin@crcusa.com'
        });

        success++;
      } catch (error) {
        errors.push(`Línea ${i + 1}: Error al procesar datos`);
      }
    }

    return { success, errors };
  };

  const importCompaniesFromCSV = (csvData: string): { success: number; errors: string[] } => {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const errors: string[] = [];
    let success = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const companyData: any = {};

        headers.forEach((header, index) => {
          companyData[header] = values[index] || '';
        });

        if (!companyData.name || !companyData.email) {
          errors.push(`Línea ${i + 1}: Nombre y email son requeridos`);
          continue;
        }

        addCompany({
          name: companyData.name,
          tradeName: companyData.tradeName || companyData.name,
          email: companyData.email,
          phone: companyData.phone || '',
          website: companyData.website || '',
          sector: companyData.sector || 'Otro',
          size: companyData.size || 'Pequeña (1-10)',
          location: companyData.location || '',
          address: companyData.address || '',
          description: companyData.description || '',
          owner: 'admin@crcusa.com'
        });

        success++;
      } catch (error) {
        errors.push(`Línea ${i + 1}: Error al procesar datos`);
      }
    }

    return { success, errors };
  };

  const exportContactsToCSV = (): string => {
    const headers = ['name', 'email', 'phone', 'company', 'role', 'status', 'score', 'interest', 'probability', 'origin', 'estimatedValue', 'location', 'isPotential', 'createdAt', 'updatedAt', 'owner'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => 
        headers.map(header => {
          const value = contact[header as keyof Contact];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const exportCompaniesToCSV = (): string => {
    const headers = ['name', 'tradeName', 'email', 'phone', 'website', 'sector', 'size', 'location', 'address', 'description', 'createdAt', 'updatedAt', 'owner'];
    const csvContent = [
      headers.join(','),
      ...companies.map(company => 
        headers.map(header => {
          const value = company[header as keyof Company];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const value = {
    contacts,
    companies,
    addContact,
    updateContact,
    deleteContact,
    addCompany,
    updateCompany,
    deleteCompany,
    linkContactToCompany,
    unlinkContactFromCompany,
    getContactsByCompany,
    importContactsFromCSV,
    importCompaniesFromCSV,
    exportContactsToCSV,
    exportCompaniesToCSV
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}