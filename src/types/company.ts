export interface Company {
  id: string;
  nombre: string;
  nombreComercial?: string;
  sector: string;
  tamaño: 'Pequeña (1-10)' | 'Mediana (11-50)' | 'Grande (50+)';
  sitioWeb?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  descripcion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuarioPropietario: string;
  contactosVinculados: string[]; // IDs de contactos
  mapLink?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

export interface CompanyFormData {
  nombre: string;
  nombreComercial?: string;
  sector: string;
  tamaño: Company['tamaño'];
  sitioWeb?: string;
  ciudad?: string;
  estado?: string;
  pais?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  descripcion?: string;
  mapLink?: string;
}

export interface CompanyFilters {
  busqueda: string;
  sector: string;
  tamaño: string;
  ciudad: string;
  pais: string;
}