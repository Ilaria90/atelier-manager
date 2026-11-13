import { getCustomers, addCustomer } from "@/actions/customer"
import Link from "next/link"
import { StatusBadge } from "@/components/StatusBadge"
import { Customer, GarmentStatus } from "@prisma/client"

// Tipo esteso che include i capi correlati
type CustomerWithGarments = Customer & {
  garments: {
    id: string
    title: string
    status: GarmentStatus
    dueDate: Date | null
  }[]
}

export default async function CustomersPage() {
  const customers = (await getCustomers()) as unknown as CustomerWithGarments[]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Gestione Clienti Atelier</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg border mb-8">
        <h2 className="text-lg font-semibold mb-4">Aggiungi Nuovo Cliente</h2>
        
        {/* Avvolgiamo la action in una funzione anonima per rispettare il tipo atteso da React */}
        <form action={async (formData) => { "use server"; await addCustomer(formData); }} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Nome e Cognome *</label>
              <input type="text" name="name" required className="w-full border p-2 rounded" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Telefono</label>
              <input type="text" name="phone" className="w-full border p-2 rounded" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" name="email" className="w-full border p-2 rounded" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Note (Es. conformazione fisica, preferenze di stile)</label>
            <textarea name="notes" rows={2} className="w-full border p-2 rounded resize-none"></textarea>
          </div>

          <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 self-end">
            Salva Cliente
          </button>
        </form>
      </div>

      {customers.length === 0 ? (
        <p className="text-gray-500">Nessun cliente registrato nel database.</p>
      ) : (
        <ul className="space-y-4">
          {customers.map((customer) => (
            <li key={customer.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">
                  <Link href={`/customers/${customer.id}`} className="hover:underline hover:text-blue-600 cursor-pointer">
                    {customer.name}
                  </Link>
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Cliente dal: {new Date(customer.createdAt).toLocaleDateString('it-IT')}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                Telefono: {customer.phone || "Non inserito"} | Email: {customer.email || "Non inserita"}
              </p>
              
              {customer.notes && (
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border-l-2 border-gray-300 mt-2">
                  📝 {customer.notes}
                </p>
              )}

              {customer.garments && customer.garments.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium block mb-2">Lavori in corso:</span>
                  <ul className="mt-3 space-y-2">
                    {customer.garments.map((g) => (
                      <li key={g.id} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded border">
                        <span className="text-gray-700 font-medium">{g.title}</span>
                        <span className="flex items-center gap-3">
                          {g.dueDate && (
                            <span className="text-xs text-gray-500">
                              {new Date(g.dueDate).toLocaleDateString("it-IT")}
                            </span>
                          )}
                          <StatusBadge status={g.status} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}