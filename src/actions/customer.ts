"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { CLOSED_STATUSES } from "@/lib/garment-status"

// 1. Definiamo le REGOLE d'ingresso con Zod
const CustomerSchema = z.object({
  name: z.string().min(2, "Il nome deve avere almeno 2 caratteri"),
  phone: z.string().optional(),
  email: z.union([z.literal(""), z.string().email("Formato email non valido")]).optional(),
  notes: z.string().optional(),
})

export async function addCustomer(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes"),
  }

  const validatedData = CustomerSchema.safeParse(rawData)

  if (!validatedData.success) {
    console.error("Dati non validi:", validatedData.error.flatten())
    return { error: "Dati inseriti non validi." }
  }

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

export async function updateCustomer(id: string, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes"),
  }

  const validatedData = CustomerSchema.safeParse(rawData)

  if (!validatedData.success) {
    console.error("Dati non validi:", validatedData.error.flatten())
    return { error: "Dati inseriti non validi." }
  }

  await db.customer.update({
    where: { id },
    data: {
      name: validatedData.data.name,
      phone: validatedData.data.phone || null,
      email: validatedData.data.email || null,
      notes: validatedData.data.notes || null,
    },
  })

  revalidatePath("/customers")
  revalidatePath(`/customers/${id}`)
}

// AGGIUNGI ANCHE QUESTA PER CANCELLARE IL CLIENTE:
export async function deleteCustomer(id: string) {
  try {
    await db.customer.delete({
      where: { id },
    })
    revalidatePath("/customers")
    return { success: true }
  } catch (error) {
    console.error("Errore durante l'eliminazione del cliente:", error)
    return { error: "Impossibile eliminare il cliente." }
  }
}