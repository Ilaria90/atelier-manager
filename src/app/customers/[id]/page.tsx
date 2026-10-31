import { db } from "@/lib/prisma"
import Link from "next/link"

// In Next.js 16 i params sono una Promise da cui estrarre l'ID
export default async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Interroghiamo il database per trovare un record specifico (l'equivalente di findById)
  const customer = await db.customer.findUnique({
    where: { id }
  })

  if (!customer) {
    return <div className="p-8">Cliente non trovato nel database.</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/customers" className="text-gray-500 hover:underline mb-6 inline-block">
        &larr; Torna alla lista
      </Link>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold mb-2">{customer.name}</h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Registrato il: {new Date(customer.createdAt).toLocaleDateString('it-IT')}
        </span>
        
        <div className="mt-8 space-y-4">
          <p><strong className="text-gray-700">Telefono:</strong> {customer.phone || "-"}</p>
          <p><strong className="text-gray-700">Email:</strong> {customer.email || "-"}</p>
          {customer.notes && (
            <div>
              <strong className="text-gray-700 block mb-1">Note sartoriali:</strong>
              <p className="bg-gray-50 p-3 rounded border-l-2 border-gray-300">{customer.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}