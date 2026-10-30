import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. Questa è una Server Action: gira sul server e salva i dati nel DB
async function addCustomer(formData: FormData) {
  "use server"
  
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string

  if (!name) return // Il nome è obbligatorio

  // Salviamo il cliente nel database usando il nostro Singleton
  await db.customer.create({
    data: { name, phone, email },
  })

  // Diciamo a Next.js di ricaricare i dati di questa pagina
  revalidatePath("/customers")
}

export default async function CustomersPage() {
  // 2. Recuperiamo tutti i clienti ordinati dal più recente
  const customers = await db.customer.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Gestione Clienti Atelier</h1>
      
      {/* 3. Modulo per aggiungere un nuovo cliente */}
      <div className="bg-gray-50 p-6 rounded-lg border mb-8">
        <h2 className="text-lg font-semibold mb-4">Aggiungi Nuovo Cliente</h2>
        <form action={addCustomer} className="flex gap-4 items-end">
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
          <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800">
            Salva
          </button>
        </form>
      </div>

      {/* 4. Lista dei clienti */}
      {customers.length === 0 ? (
        <p className="text-gray-500">Nessun cliente registrato nel database.</p>
      ) : (
        <ul className="space-y-4">
          {customers.map((customer) => (
            <li key={customer.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="font-semibold text-lg">{customer.name}</h3>
              <p className="text-sm text-gray-600">
                Telefono: {customer.phone || "Non inserito"} | Email: {customer.email || "Non inserita"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}