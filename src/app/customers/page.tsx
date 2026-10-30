import { getCustomers, addCustomer } from "@/actions/customer"

export default async function CustomersPage() {
  // Chiamiamo il nostro "Service" in modo pulito
  const customers = await getCustomers()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Gestione Clienti Atelier</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg border mb-8">
        <h2 className="text-lg font-semibold mb-4">Aggiungi Nuovo Cliente</h2>
        
        {/* Passiamo direttamente la Server Action importata */}
        <form action={addCustomer} className="flex flex-col gap-4">
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
          
          {/* Nuovo campo Note */}
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
                <h3 className="font-semibold text-lg">{customer.name}</h3>
                {/* Aggiunta la stampa formattata della data */}
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Cliente dal: {new Date(customer.createdAt).toLocaleDateString('it-IT')}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                Telefono: {customer.phone || "Non inserito"} | Email: {customer.email || "Non inserita"}
              </p>
              
              {/* Mostriamo le note solo se il cliente ne ha una */}
              {customer.notes && (
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border-l-2 border-gray-300 mt-2">
                  📝 {customer.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}