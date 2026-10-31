import { db } from "@/lib/prisma"
import Link from "next/link"
import { addMeasurement } from "@/actions/measurement" // <-- Importiamo la Server Action

export default async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Recuperiamo il cliente E includiamo le sue misure (ordinate dalla più recente)
  const customer = await db.customer.findUnique({
    where: { id },
    include: {
      measurements: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!customer) {
    return <div className="p-8">Cliente non trovato nel database.</div>
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/customers" className="text-gray-500 hover:underline mb-6 inline-block">
        &larr; Torna alla lista
      </Link>
      
      {/* Intestazione Anagrafica (esistente) */}
      <div className="bg-white p-8 rounded-lg shadow-sm border mb-8">
        <h1 className="text-3xl font-bold mb-2">{customer.name}</h1>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Modulo di Inserimento Nuove Misure */}
        <div className="bg-gray-50 p-6 rounded-lg border h-fit">
          <h2 className="text-xl font-bold mb-4">Rileva Nuove Misure (cm)</h2>
          <form action={addMeasurement} className="space-y-4">
            {/* Trucco backend: passiamo l'ID del cliente in modo invisibile */}
            <input type="hidden" name="customerId" value={customer.id} />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Torace</label>
                <input type="number" step="0.5" name="chest" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Vita</label>
                <input type="number" step="0.5" name="waist" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fianchi</label>
                <input type="number" step="0.5" name="hips" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Spalle</label>
                <input type="number" step="0.5" name="shoulders" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Manica</label>
                <input type="number" step="0.5" name="sleeve" className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Altezza</label>
                <input type="number" step="0.5" name="height" className="w-full border p-2 rounded" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Note specifiche (es. asimmetrie, vestibilità desiderata)</label>
              <textarea name="notes" rows={2} className="w-full border p-2 rounded resize-none"></textarea>
            </div>

            <button type="submit" className="w-full bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800">
              Salva Misure
            </button>
          </form>
        </div>

        {/* Storico delle Misurazioni */}
        <div>
          <h2 className="text-xl font-bold mb-4">Storico Sartoriale</h2>
          {customer.measurements.length === 0 ? (
            <p className="text-gray-500 bg-white p-4 rounded-lg border border-dashed text-center">
              Nessuna misura registrata per questo cliente.
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
                  {m.notes && (
                    <p className="text-sm mt-3 bg-yellow-50 p-2 rounded border-l-2 border-yellow-400 text-gray-700">
                      {m.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
      </div>
    </div>
  )
}