let listeners = []
let toasts = []
let uid = 0

function emit() {
  listeners.forEach((listener) => listener(toasts))
}

function push(type, message, { duration = 5000 } = {}) {
  const id = ++uid
  toasts = [...toasts, { id, type, message }]
  emit()
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration)
  }
  return id
}

function dismiss(id) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export function subscribeToasts(listener) {
  listeners.push(listener)
  listener(toasts)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

export const toast = {
  error: (message, opts) => push('error', message, opts),
  success: (message, opts) => push('success', message, opts),
  info: (message, opts) => push('info', message, opts),
  dismiss,
}
