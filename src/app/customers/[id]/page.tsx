import { db } from "@/lib/prisma"
import Link from "next/link"
import { addMeasurement } from "@/actions/measurement"
import { addGarment, updateGarmentStatus } from "@/actions/garment"
import { DeleteCustomerButton } from "@/components/DeleteCustomerButton"
import { STATUS_BADGES, CLOSED_STATUSES } from "@/lib/garment-status"

export default async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Recuperiamo il cliente includendo sia le misure che i capi
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      measurements: { orderBy: { createdAt: 'desc' } },
      garments: { orderBy: { createdAt: 'desc' } }
    }
  })

  if (!customer) {
    return <div className="p-8">Cliente non trovato nel database.</div>
  }

  // Filtra i capi in base agli stati chiusi centralizzati
  const activeGarments = customer.garments.filter((g) => !CLOSED_STATUSES.includes(g.status))
  const historyGarments = customer.garments.filter((g) => CLOSED_STATUSES.includes(g.status))

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      
      {/* 1. SEZIONE INTESTAZIONE E ANAGRAFICA */}
      <div>
        <Link href="/customers" className="text-gray-500 hover:underline mb-6 inline-block">
          &larr; Torna alla lista
        </Link>
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <Link 
              href={`/customers/${customer.id}/edit`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Modifica Dati
            </Link>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Registrato il: {new Date(customer.createdAt).toLocaleDateString('it-IT')}
          </span>
          <div className="mt-6 space-y-2">
            <p><strong className="text-gray-700">Telefono:</strong> {customer.phone || "-"}</p>
            <p><strong className="text-gray-700">Email:</strong> {customer.email || "-"}</p>
            {customer.notes && (
              <div className="mt-4">
                <strong className="text-gray-700 block mb-1">Note anagrafiche:</strong>
                <p className="bg-gray-50 p-3 rounded border-l-2 border-gray-300">{customer.notes}</p>
              </div>
            )}
            
            {/* Bottone di eliminazione */}
            <DeleteCustomerButton id={customer.id} name={customer.name} />
            
          </div>
        </div>
      </div>

      {/* 2. SEZIONE CAPI IN LAVORAZIONE E STORICO */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Capi in Lavorazione / Ordini</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Inserimento Nuovo Capo */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg border h-fit">
            <h3 className="text-lg font-bold mb-4">Nuovo Preventivo/Capo</h3>
            <form action={addGarment} className="space-y-4">
              <input type="hidden" name="customerId" value={customer.id} />
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Titolo (es. Abito oversize)*</label>
                <input type="text" name="title" required className="w-full border p-2 rounded" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Descrizione / Dettagli</label>
                <textarea name="description" rows={2} className="w-full border p-2 rounded resize-none"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Prezzo (€)</label>
                  <input type="number" step="0.01" name="price" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Acconto (€)</label>
                  <input type="number" step="0.01" name="deposit" className="w-full border p-2 rounded" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Data consegna</label>
                <input type="date" name="dueDate" className="w-full border p-2 rounded text-gray-700" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700 transition-colors">
                Crea Ordine
              </button>
            </form>
          </div>

          {/* Liste Capi (Attivi e Storico) */}
          <div className="lg:col-span-2">
            
            {/* Sotto-sezione: Capi Attivi */}
            {activeGarments.length === 0 ? (
              <p className="text-gray-500 bg-white p-4 rounded-lg border border-dashed text-center">
                Nessun capo in lavorazione per questo cliente.
              </p>
            ) : (
              <ul className="space-y-4">
                {activeGarments.map((garment) => (
                  <li key={garment.id} className="p-5 border rounded-lg shadow-sm bg-white flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg">{garment.title}</h4>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${STATUS_BADGES[garment.status].color}`}>
                          {STATUS_BADGES[garment.status].label}
                        </span>
                      </div>
                      
                      {garment.description && (
                        <p className="text-sm text-gray-600 mb-3">{garment.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                        {garment.price && <span><strong className="font-medium text-gray-500">Totale:</strong> €{garment.price.toString()}</span>}
                        {garment.deposit && <span><strong className="font-medium text-gray-500">Acconto:</strong> €{garment.deposit.toString()}</span>}
                        {garment.dueDate && <span><strong className="font-medium text-gray-500">Consegna:</strong> {new Date(garment.dueDate).toLocaleDateString('it-IT')}</span>}
                      </div>
                    </div>
                    
                    {/* Menu Cambio Stato */}
                    <div className="pt-4 border-t">
                      <form action={updateGarmentStatus} className="flex items-center gap-3">
                        <input type="hidden" name="garmentId" value={garment.id} />
                        <input type="hidden" name="customerId" value={customer.id} />
                        
                        <label className="text-sm text-gray-600 font-medium">Stato:</label>
                        <select 
                          name="status" 
                          defaultValue={garment.status} 
                          className="border rounded px-3 py-1 text-sm bg-gray-50 focus:ring-black"
                        >
                          {Object.entries(STATUS_BADGES).map(([key, badge]) => (
                            <option key={key} value={key}>{badge.label}</option>
                          ))}
                        </select>
                        
                        <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium px-4 py-1 rounded transition-colors">
                          Aggiorna
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Sotto-sezione: Storico (Consegnati / Annullati) */}
            {historyGarments.length > 0 && (
              <div className="mt-10">
                <h3 className="font-bold text-lg mb-4 text-gray-600">Storico Capi (Consegnati / Annullati)</h3>
                <ul className="space-y-4">
                  {historyGarments.map((garment) => (
                    <li key={garment.id} className="p-5 border border-gray-200 rounded-lg bg-gray-50 opacity-80 flex flex-col gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg text-gray-700">{garment.title}</h4>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${STATUS_BADGES[garment.status].color}`}>
                            {STATUS_BADGES[garment.status].label}
                          </span>
                        </div>
                        
                        {garment.description && (
                          <p className="text-sm text-gray-500 mb-3">{garment.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {garment.dueDate && <span><strong className="font-medium text-gray-400">Data originaria:</strong> {new Date(garment.dueDate).toLocaleDateString('it-IT')}</span>}
                        </div>
                      </div>
                      
                      {/* Menu Cambio Stato (Utile per riaprire un lavoro chiuso per sbaglio) */}
                      <div className="pt-4 border-t border-gray-200">
                        <form action={updateGarmentStatus} className="flex items-center gap-3">
                          <input type="hidden" name="garmentId" value={garment.id} />
                          <input type="hidden" name="customerId" value={customer.id} />
                          
                          <label className="text-sm text-gray-500 font-medium">Stato:</label>
                          <select 
                            name="status" 
                            defaultValue={garment.status} 
                            className="border border-gray-300 rounded px-3 py-1 text-sm bg-white focus:ring-black text-gray-600"
                          >
                            {Object.entries(STATUS_BADGES).map(([key, badge]) => (
                              <option key={key} value={key}>{badge.label}</option>
                            ))}
                          </select>
                          
                          <button type="submit" className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-4 py-1 rounded transition-colors">
                            Ripristina / Aggiorna
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 3. SEZIONE MISURE (RECUPERATA) */}
      <div className="pt-8 border-t">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Rilevazione Misure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg border h-fit">
            <form action={addMeasurement} className="space-y-4">
              <input type="hidden" name="customerId" value={customer.id} />
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-600 mb-1">Torace</label><input type="number" step="0.5" name="chest" className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Vita</label><input type="number" step="0.5" name="waist" className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Fianchi</label><input type="number" step="0.5" name="hips" className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Spalle</label><input type="number" step="0.5" name="shoulders" className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Manica</label><input type="number" step="0.5" name="sleeve" className="w-full border p-2 rounded" /></div>
                <div><label className="block text-sm text-gray-600 mb-1">Altezza</label><input type="number" step="0.5" name="height" className="w-full border p-2 rounded" /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Note specifiche</label>
                <textarea name="notes" rows={2} className="w-full border p-2 rounded resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
                Salva Misure
              </button>
            </form>
          </div>
          <div>
            {customer.measurements.length === 0 ? (
              <p className="text-gray-500 bg-white p-4 rounded-lg border border-dashed text-center">
                Nessuna misura registrata.
              </p>
            ) : (
              <ul className="space-y-4">
                {customer.measurements.map((m) => (
                  <li key={m.id} className="p-5 border rounded-lg shadow-sm bg-white">
                    <div className="font-semibold mb-3 border-b pb-2 text-gray-800">
                      Rilevazione del {new Date(m.createdAt).toLocaleDateString('it-IT')}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                      <p><span className="font-medium text-gray-500">Torace:</span> {m.chest || "-"} cm</p>
                      <p><span className="font-medium text-gray-500">Vita:</span> {m.waist || "-"} cm</p>
                      <p><span className="font-medium text-gray-500">Fianchi:</span> {m.hips || "-"} cm</p>
                      <p><span className="font-medium text-gray-500">Spalle:</span> {m.shoulders || "-"} cm</p>
                      <p><span className="font-medium text-gray-500">Manica:</span> {m.sleeve || "-"} cm</p>
                      <p><span className="font-medium text-gray-500">Altezza:</span> {m.height || "-"} cm</p>
                    </div>
                    {m.notes && <p className="text-sm mt-3 bg-yellow-50 p-2 rounded border-l-2 border-yellow-400 text-gray-700">{m.notes}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}