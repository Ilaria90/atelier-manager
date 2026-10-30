"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Equivalente a un metodo "findAll" in un Service Java
export async function getCustomers() {
  return await db.customer.findMany({
    orderBy: { createdAt: "desc" },
  })
}

// Equivalente a un metodo "save"
export async function addCustomer(formData: FormData) {
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const notes = formData.get("notes") as string // <-- Aggiunto

  if (!name) return // Validazione base

  await db.customer.create({
    data: { name, phone, email, notes }, // <-- Aggiunto al salvataggio
  })

  // Diciamo a Next.js di aggiornare la pagina clienti dopo l'inserimento
  revalidatePath("/customers")
}