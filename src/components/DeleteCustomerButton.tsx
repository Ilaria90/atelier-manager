"use client"

import { useState, useTransition } from "react"
import { deleteCustomer } from "@/actions/customer"
import { useRouter } from "next/navigation"

export function DeleteCustomerButton({ id, name }: { id: string; name: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    if (!confirm(`Sei sicuro di voler eliminare ${name}? L'operazione non si può annullare.`)) return

    startTransition(async () => {
      const res = await deleteCustomer(id)
      if (!res.ok) {
        setError(res.error ?? "Errore sconosciuto")
      } else {
        // Se va a buon fine, reindirizziamo alla lista clienti
        router.push("/customers")
      }
    })
  }

  return (
    <div className="mt-6 border-t pt-4">
      <button 
        onClick={handleClick} 
        disabled={pending}
        className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
      >
        {pending ? "Eliminazione in corso..." : "Elimina definitivamente questo cliente"}
      </button>
      {error && (
        <div className="mt-3 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}