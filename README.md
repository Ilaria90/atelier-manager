# 🪡 Atelier Manager

Gestionale web per sartorie e laboratori di alta moda: anagrafica clienti, schede misure e ciclo di vita di ogni capo, dal preventivo alla consegna. Nato dall'esperienza diretta in sartoria, per sostituire carta e quaderni con uno strumento semplice e a misura d'atelier.

![Dashboard](docs/screenshots/dashboard.png)

## ✨ Funzionalità

- **Dashboard:** capi in lavorazione ordinati per scadenza, capi in ritardo, pronti per il ritiro e preventivi in attesa.
- **Rubrica clienti:** contatti, note e capi aperti visibili a colpo d'occhio.
- **Schede misure:** storico delle rilevazioni (torace, vita, fianchi, spalle, manica, altezza) con data.
- **Workflow dei capi:** Preventivo → Confermato → In lavorazione → In prova → Rifiniture → Pronto → Consegnato (o Annullato). I capi chiusi passano automaticamente nello storico.
- **Eliminazione sicura:** un cliente con capi o misure collegati non può essere cancellato, per non perdere lo storico per errore.
- **Validazione lato server** di tutti i form con Zod.

## 🚀 Tecnologie

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL (Docker), Prisma 7 con driver adapter
- **Validazione:** Zod
- **Linguaggio:** TypeScript

## 🛠️ Avvio in locale

Requisiti: Node.js e Docker Desktop.

```bash
git clone https://github.com/Ilaria90/atelier-manager.git
cd atelier-manager
npm install
cp .env.example .env
docker compose up -d
npx prisma migrate dev
npx prisma db seed   # dati di esempio
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## 🗺️ Possibili sviluppi

- Ricerca e filtri sui clienti
- Calendario delle consegne
- Esportazione PDF della scheda misure
- Autenticazione e più utenti