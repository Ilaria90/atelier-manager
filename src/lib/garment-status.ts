import type { GarmentStatus } from "@prisma/client"

export const STATUS_BADGES: Record<GarmentStatus, { label: string; color: string }> = {
  QUOTE:       { label: "Preventivo",     color: "bg-gray-100 text-gray-800" },
  CONFIRMED:   { label: "Confermato",     color: "bg-blue-100 text-blue-800" },
  IN_PROGRESS: { label: "In Lavorazione", color: "bg-purple-100 text-purple-800" },
  FITTING:     { label: "In Prova",       color: "bg-orange-100 text-orange-800" },
  FINISHING:   { label: "Rifiniture",     color: "bg-yellow-100 text-yellow-800" },
  READY:       { label: "Pronto",         color: "bg-green-100 text-green-800" },
  DELIVERED:   { label: "Consegnato",     color: "bg-emerald-100 text-emerald-800" },
  CANCELLED:   { label: "Annullato",      color: "bg-red-100 text-red-800" },
}
export const CLOSED_STATUSES: GarmentStatus[] = ["DELIVERED", "CANCELLED"]