"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { CLOSED_STATUSES } from "@/lib/garment-status"

// 1. Definiamo le REGOLE d'ingresso con Zod
const CustomerSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  // phone ed email sono opzionali, ma se ci sono, l'email deve avere il formato giusto (@)
  phone: z.string().optional(),
  email: z.union([z.literal(""), z.string().email("Formato email non valido")]).optional(),
  notes: z.string().optional(),
})

export async function addCustomer(formData: FormData) {
  // 2. Estraiamo i dati crudi
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes"),
  }

  // 3. Zod controlla i dati. Se fallisce, blocca tutto.
  const validatedData = CustomerSchema.safeParse(rawData)

  if (!validatedData.success) {
    console.error("Dati non validi:", validatedData.error.flatten())
    return { error: "Dati inseriti non validi." }
  }

  // 4. Se arriviamo qui, i dati sono sicuri al 100% (TypeScript lo sa e ci suggerisce i campi!)
  await db.customer.create({
    data: {
      name: validatedData.data.name,
      phone: validatedData.data.phone || null,
      email: validatedData.data.email || null,
      notes: validatedData.data.notes || null,
    }
  })

  revalidatePath("/customers")
}

export async function getCustomers() {
  return await db.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      garments: {
        where: { status: { notIn: CLOSED_STATUSES } },
        orderBy: { dueDate: "asc" },
        select: { id: true, title: true, status: true, dueDate: true },
      },
    },
  })
}