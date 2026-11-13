import { db } from "@/lib/prisma"
import { updateCustomer } from "@/actions/customer"
import Link from "next/link"
import { StatusBadge } from "@/components/StatusBadge"
import { DeleteCustomerButton } from "@/components/DeleteCustomerButton"
import { ActionForm } from "@/components/ActionForm"
import { Customer, Garment, Measurement, GarmentStatus } from "@prisma/client"

type CustomerWithRelations = Customer & {
  garments: (Garment & { status: GarmentStatus })[]
  measurements: Measurement[]
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const id = resolvedParams?.id

  if (!id || id === "undefined") {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-red-600 font-medium">ID cliente non valido o mancante.</p>
        <Link href="/customers" className="text-blue-600 underline mt-4 inline-block">
          &larr; Torna alla lista clienti
        </Link>
      </div>
    )
  }

  const rawCustomer = await db.customer.findUnique({
    where: { id },
    include: {
      garments: {
        orderBy: { createdAt: "desc" },
      },
      measurements: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  const customer = rawCustomer as unknown as CustomerWithRelations | null

  if (!customer) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <p className="text-red-600 font-medium">Cliente non trovato.</p>
        <Link href="/customers" className="text-blue-600 underline mt-4 inline-block">
          &larr; Torna alla lista clienti
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/customers" className="text-sm text-gray-500 hover:text-black">
          &larr; Torna a Tutti i Clienti
        </Link>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">{customer.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Cliente registrato il {new Date(customer.createdAt).toLocaleDateString("it-IT")}
          </p>
        </div>
      </div>

      {/* Scheda Modifica Dati Cliente con ActionForm */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Modifica Dati Cliente</h2>
        
        <ActionForm action={updateCustomer.bind(null, id)} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Nome e Cognome *</label>
              <input 
                type="text" 
                name="name" 
                defaultValue={customer.name} 
                required 
                className="w-full border p-2 rounded" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Telefono</label>
              <input 
                type="text" 
                name="phone" 
                defaultValue={customer.phone || ""} 
                className="w-full border p-2 rounded" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input 
                type="email" 
                name="email" 
                defaultValue={customer.email || ""} 
                className="w-full border p-2 rounded" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Note (conformazione, preferenze)</label>
            <textarea 
              name="notes" 
              rows={2} 
              defaultValue={customer.notes || ""} 
              className="w-full border p-2 rounded resize-none"
            ></textarea>
          </div>

          <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 self-end">
            Aggiorna Cliente
          </button>
        </ActionForm>
      </div>

      {/* Sezione Misure */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Misure Anatomiche</h2>
          <Link 
            href={`/customers/${id}/measurements/new`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm font-medium"
          >
            + Aggiungi Misura
          </Link>
        </div>

        {customer.measurements.length === 0 ? (
          <p className="text-gray-500 text-sm">Nessuna misura registrata per questo cliente.</p>
        ) : (
          <ul className="space-y-3">
            {customer.measurements.map((m) => (
              <li key={m.id} className="p-3 border rounded bg-gray-50 flex justify-between items-center text-sm">
                <span>Registrate il: {new Date(m.createdAt).toLocaleDateString("it-IT")}</span>
                <Link href={`/customers/${id}/measurements/${m.id}`} className="text-blue-600 hover:underline">
                  Vedi dettagli
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sezione Capi / Lavori */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Capi / Lavori dell&apos;Atelier</h2>
          <Link 
            href={`/garments/new?customerId=${id}`}
            className="bg-black text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-800"
          >
            + Nuovo Capo
          </Link>
        </div>

        {customer.garments.length === 0 ? (
          <p className="text-gray-500 text-sm">Nessun capo associato a questo cliente.</p>
        ) : (
          <ul className="space-y-3">
            {customer.garments.map((g) => (
              <li key={g.id} className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-base text-gray-900">{g.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Consegna prevista: {g.dueDate ? new Date(g.dueDate).toLocaleDateString("it-IT") : "Non definita"}
                  </p>
                </div>
                <StatusBadge status={g.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pulsante di eliminazione sicura */}
      <DeleteCustomerButton id={customer.id} name={customer.name} />
    </div>
  )
}