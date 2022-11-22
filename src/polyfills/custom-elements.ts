const root = typeof globalThis !== 'undefined' ? globalThis : window
root.customElements ??= {
  define() {},
  get() {},
  update() {},
  whenDefined() {
    return new Promise(() => {})
  }
} as unknown as CustomElementRegistry
root.HTMLElement ??= class HTMLElement {} as unknown as typeof HTMLElement
root.Event ??= class Event {} as unknown as typeof Event
