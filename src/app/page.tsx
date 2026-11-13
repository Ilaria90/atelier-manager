import { db } from "@/lib/prisma"
import Link from "next/link"
import { STATUS_BADGES } from "@/lib/garment-status" // <-- Importiamo le etichette

export const dynamic = "force-dynamic"

export default async function Home() {
  const [activeGarments, readyGarments, pendingQuotesCount] = await Promise.all([
    db.garment.findMany({
      where: { status: { in: ['CONFIRMED', 'IN_PROGRESS', 'FITTING', 'FINISHING'] } },
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { dueDate: 'asc' }
    }),
    db.garment.findMany({
      where: { status: 'READY' },
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { dueDate: 'asc' }
    }),
    db.garment.count({
      where: { status: 'QUOTE' }
    })
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">Dashboard Atelier</h1>

      {/* RECAP NUMERICO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-purple-500">
          <h3 className="text-gray-500 text-sm font-medium">Capi in Lavorazione</h3>
          <p className="text-3xl font-bold mt-2">{activeGarments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Pronti da Consegnare</h3>
          <p className="text-3xl font-bold mt-2">{readyGarments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-gray-400">
          <h3 className="text-gray-500 text-sm font-medium">Preventivi in Attesa</h3>
          <p className="text-3xl font-bold mt-2">{pendingQuotesCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTA LAVORI IN CORSO */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="bg-gray-50 border-b px-6 py-4">
            <h2 className="text-lg font-bold text-gray-800">Scadenze e Lavori in Corso</h2>
          </div>
          <div className="p-6">
            {activeGarments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nessun capo in lavorazione al momento.</p>
            ) : (
              <ul className="space-y-4">
                {activeGarments.map(garment => {
                  const isOverdue = garment.dueDate && new Date(garment.dueDate) < today
                  const badge = STATUS_BADGES[garment.status] // <-- Usiamo l'oggetto centralizzato
                  
                  return (
                    <li key={garment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <Link href={`/customers/${garment.customer.id}`} className="font-bold text-indigo-600 hover:underline">
                          {garment.customer.name}
                        </Link>
                        <p className="text-sm text-gray-600">{garment.title}</p>
                        {garment.dueDate && (
                          <p className={`text-xs font-medium mt-1 ${isOverdue ? 'text-red-600 font-bold bg-red-50 p-1 rounded inline-block' : 'text-gray-500'}`}>
                            {isOverdue ? "⚠️ IN RITARDO: " : "Consegna: "} 
                            {new Date(garment.dueDate).toLocaleDateString('it-IT')}
                          </p>
                        )}
                      </div>
                      <div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${badge.color}`}>{badge.label}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {/* LISTA PRONTI PER IL RITIRO */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border overflow-hidden h-fit">
          <div className="bg-green-50 border-b border-green-100 px-6 py-4">
            <h2 className="text-lg font-bold text-green-800">Pronti per il Ritiro</h2>
          </div>
          <div className="p-6">
            {readyGarments.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">Nessun capo da consegnare.</p>
            ) : (
              <ul className="space-y-3">
                {readyGarments.map(garment => (
                  <li key={garment.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <Link href={`/customers/${garment.customer.id}`} className="font-bold text-gray-800 hover:text-indigo-600 block text-sm">
                      {garment.customer.name}
                    </Link>
                    <span className="text-sm text-gray-600">{garment.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-8">
        <Link href="/customers" className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block">
          Vai alla Rubrica Clienti &rarr;
        </Link>
      </div>
    </div>
  )
}