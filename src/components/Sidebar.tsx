"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users } from "lucide-react"

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Clienti", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="group fixed inset-y-0 left-0 z-50 w-16 overflow-hidden bg-rose-950 text-rose-50 transition-[width] duration-200 hover:w-60 focus-within:w-60 shadow-xl">
      <div className="flex h-16 items-center whitespace-nowrap px-5 font-bold">
        <span className="w-6 shrink-0 text-center">A</span>
        <span className="ml-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          Atelier Manager
        </span>
      </div>
      <nav className="space-y-1 px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex items-center gap-4 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-rose-800 text-white" : "text-rose-200 hover:bg-rose-900"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}