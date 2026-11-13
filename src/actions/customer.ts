"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
export async function deleteCustomer(id: string) {
  try {
    // Conta quanti capi e misure ha questo cliente
    const [measures, garments] = await Promise.all([
      db.measurement.count({ where: { customerId: id } }),
      db.garment.count({ where: { customerId: id } }),
    ])

    // Blocco di sicurezza: se ha dati, rifiuta l'eliminazione
    if (measures > 0 || garments > 0) {
      return {
        ok: false,
        error: `Impossibile eliminare: il cliente ha ${garments} capi e ${measures} misure registrate. Rimuovi prima i suoi capi/misure o usa la funzione di archiviazione.`,
      }
    }

    // Se è vuoto, procedi con l'eliminazione
    await db.customer.delete({ where: { id } })
    
    // Aggiorna la pagina della lista clienti
    revalidatePath("/customers")
    
    return { ok: true }
  } catch (error) {
    return { ok: false, error: "Errore critico durante l'eliminazione." }
  }
}
export async function updateCustomer(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const notes = formData.get("notes") as string

  // Il nome è obbligatorio
  if (!id || !name) return

  // Aggiorna il record nel database
  await db.customer.update({
    where: { id },
    data: {
      name,
      phone: phone || null,
      email: email || null,
      notes: notes || null,
    }
  })

  // Svuota la cache e ricarica la pagina del cliente con i nuovi dati
  revalidatePath(`/customers/${id}`)
  
  // Riporta l'utente alla scheda del cliente appena modificata
  redirect(`/customers/${id}`)
}