import { Customer, Measurement, GarmentOrder } from './index';

// Dati fittizi per i Clienti dell'Atelier
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    firstName: 'Eleonora',
    lastName: 'Rossi',
    phone: '+39 333 1234567',
    email: 'eleonora.rossi@example.com',
    notes: 'Preferisce tessuti in seta e lana vergine. Appuntamenti di sabato.',
    createdAt: new Date('2026-09-10'),
  },
  {
    id: 'cust-2',
    firstName: 'Beatrice',
    lastName: 'Neri',
    phone: '+39 347 9876543',
    email: 'beatrice.neri@example.com',
    notes: 'Richiesto abito su misura per cerimonia a giugno.',
    createdAt: new Date('2026-09-15'),
  },
];

// Dati fittizi per le Misure sartoriali
export const mockMeasurements: Measurement[] = [
  {
    id: 'meas-1',
    customerId: 'cust-1',
    chest: 88,
    waist: 70,
    hips: 94,
    shoulderWidth: 40,
    sleeveLength: 60,
    totalLength: 105,
    updatedAt: new Date('2026-09-10'),
  },
  {
    id: 'meas-2',
    customerId: 'cust-2',
    chest: 92,
    waist: 74,
    hips: 98,
    shoulderWidth: 42,
    sleeveLength: 62,
    totalLength: 110,
    updatedAt: new Date('2026-09-15'),
  },
];

// Dati fittizi per i Capi / Ordini in lavorazione
export const mockOrders: GarmentOrder[] = [
  {
    id: 'order-1',
    customerId: 'cust-1',
    title: 'Tailleur sartoriale blu notte',
    status: 'IN_PROGRESS',
    deadline: new Date('2026-11-15'),
    price: 850,
  },
  {
    id: 'order-2',
    customerId: 'cust-2',
    title: 'Abito lungo da sera in seta',
    status: 'CONSULTATION',
    deadline: new Date('2026-12-01'),
    price: 1200,
  },
];