type Handler<E> = (event: E) => void

export function composeEventHandlers<E>(...handlers: Array<Handler<E> | null | undefined>) {
  return function handleEvent(event: E) {
    for (const handler of handlers) {
      handler?.(event)
      if ((event as unknown as Event).defaultPrevented) {
        break
      }
    }
  }
}
