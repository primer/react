const warnedMessages = new Set<string>()

export function devWarning(id: string, message: string): void {
  if (process.env.NODE_ENV === 'production') return
  const formatted = `[${id}] ${message}`
  if (warnedMessages.has(formatted)) return
  warnedMessages.add(formatted)
  // eslint-disable-next-line no-console
  console.warn(formatted)
}

export function resetDevWarningsForTest(): void {
  warnedMessages.clear()
}
