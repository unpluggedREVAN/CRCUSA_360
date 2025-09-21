export interface Contact {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  empresaId?: string;
  cargo?: string;
  estado: 'Primer contacto' | 'Segundo contacto' | 'Propuesta' | 'Cerrado' | 'No Potencial';
  score: number; // 1-5
  origen: 'Web' | 'Referido' | 'Evento' | 'Cold Call' | 'LinkedIn' | 'Email' | 'Otro';
  interes: 'Alto' | 'Medio' | 'Bajo';
  probabilidadConversion: number; // 0-100
  valorEstimado: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuarioPropietario: string;
  notas?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  sitioWeb?: string;
  linkedin?: string;
  isNoPotencial: boolean;
  historialEstados: EstadoHistorial[];
}

export interface EstadoHistorial {
  id: string;
  estadoAnterior: string;
  estadoNuevo: string;
  fecha: string;
  usuario: string;
  comentario?: string;
}

export interface ContactFormData {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  empresaId?: string;
  cargo?: string;
  estado: Contact['estado'];
  origen: Contact['origen'];
  interes: Contact['interes'];
  probabilidadConversion: number;
  valorEstimado: number;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  sitioWeb?: string;
  linkedin?: string;
  notas?: string;
}

export interface ContactFilters {
  busqueda: string;
  estado: string;
  origen: string;
  interes: string;
  scoreMin: number;
  scoreMax: number;
  probabilidadMin: number;
  probabilidadMax: number;
  fechaDesde?: string;
  fechaHasta?: string;
  noPotenciales: boolean;
}