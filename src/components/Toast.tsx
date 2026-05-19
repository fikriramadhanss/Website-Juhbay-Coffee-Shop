import { CheckCircle, XCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message: string
}

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onDismiss(toast.id), 300)
    }, 4500)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const handleDismiss = () => {
    setExiting(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }

  const Icon = toast.type === 'success' ? CheckCircle : XCircle
  const borderColor = toast.type === 'success' ? 'border-green-200' : 'border-red-200'
  const iconColor = toast.type === 'success' ? 'text-green-600' : 'text-red-500'
  const bgColor = toast.type === 'success' ? 'bg-green-50' : 'bg-red-50'

  return (
    <div
      className={`flex items-start gap-3 w-80 rounded-xl border ${borderColor} ${bgColor} p-4 shadow-lg shadow-espresso/10 ${exiting ? 'toast-exit' : 'toast-enter'}`}
      role="alert"
    >
      <Icon size={18} className={`${iconColor} mt-0.5 shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-espresso">{toast.title}</p>
        <p className="text-xs text-espresso/60 mt-0.5 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-espresso/30 hover:text-espresso transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
