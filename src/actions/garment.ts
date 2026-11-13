"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { GarmentStatus } from "@prisma/client" 
import { z } from "zod"

// 1. Definiamo le REGOLE per i capi (Zod gestisce anche la conversione da stringa a numero/data!)
const GarmentSchema = z.object({
  customerId: z.string().min(1, "ID Cliente mancante"),
  title: z.string().min(2, "Il titolo deve avere almeno 2 caratteri"),
  description: z.string().optional(),
  // Trasforma la stringa in numero, se è vuota diventa null
  price: z.string().optional().transform(val => val ? Number(val) : null),
  deposit: z.string().optional().transform(val => val ? Number(val) : null),
  // Trasforma la stringa in Date, se è vuota diventa null
  dueDate: z.string().optional().transform(val => val ? new Date(val) : null),
})

// Schema di sicurezza per il cambio di stato
const StatusSchema = z.object({
  garmentId: z.string().min(1),
  customerId: z.string().min(1),
  // Assicura che lo stato sia uno di quelli validi nel database
  status: z.nativeEnum(GarmentStatus), 
})

export async function addGarment(formData: FormData) {
  // 2. Estraiamo i dati crudi
  const rawData = {
    customerId: formData.get("customerId"),
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    deposit: formData.get("deposit"),
    dueDate: formData.get("dueDate"),
  }

  // 3. Zod valida e converte i dati
  const validatedData = GarmentSchema.safeParse(rawData)

  if (!validatedData.success) {
    console.error("Dati capo non validi:", validatedData.error.flatten())
    return { error: "Dati inseriti non validi." }
  }

  // 4. Scrittura sicura nel database con i dati già tipizzati e puliti
  await db.garment.create({
    data: validatedData.data
  })

  // Svuota la cache e aggiorna le pagine
  revalidatePath(`/customers/${validatedData.data.customerId}`)
  revalidatePath("/")
  revalidatePath("/customers")
}

export async function updateGarmentStatus(formData: FormData) {
  const rawData = {
    garmentId: formData.get("garmentId"),
    customerId: formData.get("customerId"),
    status: formData.get("status"),
  }

  const validatedData = StatusSchema.safeParse(rawData)

  if (!validatedData.success) {
    console.error("Stato non valido:", validatedData.error.flatten())
    return { error: "Stato non valido." }
  }

  await db.garment.update({
    where: { id: validatedData.data.garmentId },
    data: { status: validatedData.data.status }
  })

  revalidatePath(`/customers/${validatedData.data.customerId}`)
  revalidatePath("/")
  revalidatePath("/customers")
}