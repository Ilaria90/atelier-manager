"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { GarmentStatus } from "@prisma/client" 
// 1. Funzione per creare un nuovo preventivo/capo
export async function addGarment(formData: FormData) {
  const customerId = formData.get("customerId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  
  const priceStr = formData.get("price") as string
  const depositStr = formData.get("deposit") as string
  const dueDateStr = formData.get("dueDate") as string

  if (!customerId || !title) return

  await db.garment.create({
    data: {
      customerId,
      title,
      description: description || null,
      price: priceStr ? Number(priceStr) : null,
      deposit: depositStr ? Number(depositStr) : null,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
    }
  })

  revalidatePath(`/customers/${customerId}`)
}

// 2. Funzione per aggiornare lo stato di lavorazione
export async function updateGarmentStatus(formData: FormData) {
  const garmentId = formData.get("garmentId") as string
  const customerId = formData.get("customerId") as string
const status = formData.get("status") as GarmentStatus
  if (!garmentId || !status) return

  await db.garment.update({
    where: { id: garmentId },
    data: { status }
  })

  revalidatePath(`/customers/${customerId}`)
}