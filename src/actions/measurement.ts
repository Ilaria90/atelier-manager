"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addMeasurement(formData: FormData) {
  // L'ID del cliente sarà un campo nascosto nel form
  const customerId = formData.get("customerId") as string
  
  if (!customerId) return

  // Estraiamo i valori dal form e li convertiamo in Float (se presenti)
  const chest = formData.get("chest") ? parseFloat(formData.get("chest") as string) : null
  const waist = formData.get("waist") ? parseFloat(formData.get("waist") as string) : null
  const hips = formData.get("hips") ? parseFloat(formData.get("hips") as string) : null
  const shoulders = formData.get("shoulders") ? parseFloat(formData.get("shoulders") as string) : null
  const sleeve = formData.get("sleeve") ? parseFloat(formData.get("sleeve") as string) : null
  const height = formData.get("height") ? parseFloat(formData.get("height") as string) : null
  const notes = formData.get("notes") as string

  // Salviamo nel database usando la relazione
  await db.measurement.create({
    data: {
      customerId,
      chest,
      waist,
      hips,
      shoulders,
      sleeve,
      height,
      notes
    }
  })

  // Diciamo a Next.js di ricaricare la pagina specifica di QUESTO cliente
  revalidatePath(`/customers/${customerId}`)
}