import 'dotenv/config' // Carica le variabili d'ambiente dal file .env
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Configurazione specifica per Prisma 7 con Driver Adapter per PostgreSQL
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Pulisce il database (così puoi ri-eseguire il seed quante volte vuoi senza duplicati)
  await prisma.garment.deleteMany()
  await prisma.measurement.deleteMany()
  await prisma.customer.deleteMany()

  // 2. Crea il primo cliente: Eleonora (con misure e capi attivi/storico)
  await prisma.customer.create({
    data: {
      name: 'Eleonora Rossi',
      phone: '+39 333 1234567',
      email: 'eleonora.rossi@example.com',
      notes: 'Preferisce tessuti in seta e lana vergine. Appuntamenti di sabato.',
      measurements: {
        create: {
          chest: 90,
          waist: 70,
          hips: 95,
          shoulders: 40,
          sleeve: 60,
          height: 170,
          notes: 'Misure prese con scarpe da 5cm'
        }
      },
      garments: {
        create: [
          {
            title: 'Abito da cerimonia in seta',
            description: 'Abito lungo blu notte con scollo a V',
            price: 850,
            deposit: 300,
            status: 'FITTING', // In Prova
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Scadenza tra 1 mese
          },
          {
            title: 'Gonna a ruota',
            description: 'Gonna in lana vergine bordeaux',
            price: 250,
            deposit: 250,
            status: 'DELIVERED', // Consegnato (andrà nello Storico)
            dueDate: new Date(new Date().setMonth(new Date().getMonth() - 1)) // Consegnato 1 mese fa
          }
        ]
      }
    }
  })

  // 3. Crea il secondo cliente: Marco (solo un capo in preventivo)
  await prisma.customer.create({
    data: {
      name: 'Marco Bianchi',
      phone: '+39 340 9876543',
      notes: 'Giacche sempre con spacco laterale. Allergico alle fibre sintetiche.',
      garments: {
        create: [
          {
            title: 'Giacca monopetto',
            description: 'Giacca estiva in lino beige',
            price: 450,
            deposit: 150,
            status: 'QUOTE', // Preventivo
          }
        ]
      }
    }
  })

  console.log('✅ Database popolato con successo con i dati di esempio!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })