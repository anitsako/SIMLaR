export interface ServicioContacto {
  id: number;
  nombre: string;
  descripcion: string;
  tramites: string;
  direccion: string | null;
  latitud: number | null;
  longitud: number | null;
  horario: string | null;
  telefono: string | null;
  whatsapp: string | null;
  email: string | null;
  sitioWeb: string | null;
  facebook: string | null;
  instagram: string | null;
  visible: boolean;
  orden: number;
}

export interface ServicioContactoFormData {
  id?: number;
  nombre: string;
  descripcion: string;
  tramites: string;
  direccion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  horario?: string | null;
  telefono?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  sitioWeb?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  visible: boolean;
  orden: number;
}
