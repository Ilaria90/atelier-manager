import { db } from "@/lib/prisma"
import { updateCustomer } from "@/actions/customer"
import Link from "next/link"
import { ActionForm } from "@/components/ActionForm"

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = await db.customer.findUnique({
    where: { id },
  })

  if (!customer) {
    return <p className="p-8">Cliente non trovato.</p>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifica Cliente</h1>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        {/* Usiamo ActionForm e .bind per passare l'id alla Server Action */}
        <ActionForm action={updateCustomer.bind(null, id)} className="flex flex-col gap-4">
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
            <label className="block text-sm text-gray-600 mb-1">Note</label>
            <textarea 
              name="notes" 
              rows={3} 
              defaultValue={customer.notes || ""} 
              className="w-full border p-2 rounded resize-none"
            ></textarea>
          </div>

          <div className="flex justify-between items-center mt-2">
            <Link href={`/customers/${id}`} className="text-sm text-gray-600 hover:underline">
              Annulla
            </Link>
            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800">
              Salva Modifiche
            </button>
          </div>
        </ActionForm>
      </div>
    </div>
  )
}