"use client"

import { useActionState } from "react"
import type { FormState } from "@/lib/form-state"

type ActionWithState = (prev: FormState, formData: FormData) => Promise<FormState>
type ActionWithoutState = (formData: FormData) => Promise<FormState>

export function ActionForm({
  action,
  children,
  className,
}: {
  action: ActionWithState | ActionWithoutState
  children: React.ReactNode
  className?: string
}) {
  // Verifichiamo la firma in modo sicuro senza usare any
  const wrappedAction: ActionWithState = async (prev: FormState, formData: FormData): Promise<FormState> => {
    // Se l'action accetta due argomenti (es. con .bind o standard useActionState)
    if (action.length >= 2) {
      return await (action as ActionWithState)(prev, formData)
    }
    // Altrimenti è un'action classica che prende solo il formData
    return await (action as ActionWithoutState)(formData)
  }

  const [state, formAction] = useActionState(wrappedAction, undefined)

  return (
    <form action={formAction} className={className}>
      {children}
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          ⚠️ {state.error}
        </p>
      )}
    </form>
  )
}