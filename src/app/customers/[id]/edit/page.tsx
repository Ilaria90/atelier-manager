import { db } from "@/lib/prisma"
import { updateCustomer } from "@/actions/customer"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Recupera i dati attuali del cliente
  const customer = await db.customer.findUnique({
    where: { id }
  })

  // Se non esiste, rimanda alla lista
  if (!customer) {
    redirect("/customers")
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href={`/customers/${id}`} className="text-gray-500 hover:underline mb-6 inline-block">
        &larr; Annulla e torna alla scheda
      </Link>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-6">Modifica Cliente</h1>
        
        <form action={updateCustomer} className="space-y-4">
          {/* Campo nascosto per passare l'ID */}
          <input type="hidden" name="id" value={customer.id} />
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nome e Cognome *</label>
            <input 
              type="text" 
              name="name" 
              defaultValue={customer.name} 
              required 
              className="w-full border p-2 rounded" 
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Telefono</label>
            <input 
              type="text" 
              name="phone" 
              defaultValue={customer.phone || ""} 
              className="w-full border p-2 rounded" 
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              defaultValue={customer.email || ""} 
              className="w-full border p-2 rounded" 
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Note (taglie preferite, intolleranze ai tessuti, ecc.)</label>
            <textarea 
              name="notes" 
              defaultValue={customer.notes || ""} 
              rows={4} 
              className="w-full border p-2 rounded resize-none"
            ></textarea>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}