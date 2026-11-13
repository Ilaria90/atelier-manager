import type { GarmentStatus } from "@prisma/client"
import { STATUS_BADGES } from "@/lib/garment-status"

export function StatusBadge({ status }: { status: GarmentStatus }) {
  const { label, color } = STATUS_BADGES[status]
  
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded ${color}`}>
      {label}
    </span>
  )
}