// Tipi di base per l'Atelier Manager

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: Date;
}

export interface Measurement {
  id: string;
  customerId: string;
  // Misure sartoriali chiave (in centimetri)
  chest: number;        // Circonferenza seno/torace
  waist: number;        // Circonferenza vita
  hips: number;         // Circonferenza bacino
  shoulderWidth: number;// Larghezza spalle
  sleeveLength: number; // Lunghezza manica
  totalLength: number;  // Lunghezza capo desiderata
  updatedAt: Date;
}

export interface GarmentOrder {
  id: string;
  customerId: string;
  title: string;        // Es. "Abito da sposa", "Tailor-made coat"
  status: 'CONSULTATION' | 'IN_PROGRESS' | 'FITTING' | 'COMPLETED';
  deadline?: Date;
  price?: number;
}