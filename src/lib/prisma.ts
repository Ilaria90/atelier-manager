import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// 1. Definiamo l'indirizzo base e togliamo i parametri extra che confondono il driver 'pg'
const connectionString = "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable"

// 2. Creiamo il Singleton per il client Prisma
const globalForPrisma = globalThis as unknown as { 
  prisma: PrismaClient | undefined 
}

// 3. Inizializziamo in modo protetto
if (!globalForPrisma.prisma) {
  // Configuriamo il Pool in modo che Next.js/Turbopack non lo sovraccarichi
  const pool = new Pool({ 
    connectionString,
    max: 1, // Fondamentale: limita le connessioni simultanee a 1 in sviluppo
    idleTimeoutMillis: 0, // Evita che la connessione venga chiusa per inattività
  })
  
  const adapter = new PrismaPg(pool)
  globalForPrisma.prisma = new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}