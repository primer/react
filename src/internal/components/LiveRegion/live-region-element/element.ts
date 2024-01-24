let template: HTMLTemplateElement | null = null

const templateContent = `
<style>
:host {
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
</style>
<div id="polite" aria-live="polite" aria-atomic="true"></div>
<div id="assertive" aria-live="assertive" aria-atomic="true"></div>
`

function getTemplate() {
  if (template) {
    return template
  }
  template = document.createElement('template')
  template.innerHTML = templateContent
  return template
}

type Politeness = 'polite' | 'assertive'

export type AnnounceOptions = {
  delayMs?: number
  politeness?: Politeness
}

export type Cancelable = () => void

const DEFAULT_FLUSH_DELAY_MS = 150

class LiveRegionElement extends HTMLElement {
  #pending: boolean
  #queue: Array<{
    data: readonly [string, AnnounceOptions]
    cancel: Cancelable
  }>

  constructor() {
    super()

    this.#pending = false
    this.#queue = []

    if (!this.shadowRoot) {
      const template = getTemplate()
      const shadowRoot = this.attachShadow({mode: 'open'})
      shadowRoot.appendChild(template.content.cloneNode(true))
    }
  }

  connectedCallback() {
    if (this.#queue.length > 0) {
      for (const item of this.#queue) {
        const [, options] = item.data
        // Add a default delayMs when flushing the queue if none exists
        if (options.delayMs === undefined) {
          options.delayMs = DEFAULT_FLUSH_DELAY_MS
        }
      }
      this.#processQueue()
    }
  }

  #processQueue() {
    if (!this.isConnected) {
      return
    }

    if (this.#pending) {
      return
    }

    if (this.#queue.length === 0) {
      return
    }

    const item = this.#queue.shift()
    if (item === undefined) {
      return
    }

    this.#pending = true

    const [message, options] = item.data
    const {delayMs, politeness = 'polite'} = options

    if (delayMs === undefined) {
      this.setMessage(message, politeness)
      this.#pending = false
      this.#processQueue()
      return
    }

    let timeoutId: number | null

    item.cancel = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }

    timeoutId = window.setTimeout(() => {
      timeoutId = null

      this.setMessage(message, politeness)
      this.#pending = false
      this.#processQueue()
    }, delayMs)
  }

  announce(message: string, options: AnnounceOptions = {}): Cancelable {
    const item = {
      data: [message, options] as const,
      cancel: () => {
        const index = this.#queue.indexOf(item)
        if (index !== -1) {
          this.#queue.splice(index, 1)
        }
      },
    }
    this.#queue.push(item)
    this.#processQueue()
    return () => {
      item.cancel()
    }
  }

  announceFromElement(element: HTMLElement, options: AnnounceOptions = {}): Cancelable {
    if (element.textContent) {
      return this.announce(element.textContent, options)
    }
    return () => {}
  }

  getMessage(politeness: Politeness = 'polite') {
    const container = this.shadowRoot?.getElementById(politeness)
    if (!container) {
      throw new Error('Unable to find container for politeness message')
    }
    return container.textContent
  }

  setMessage(message: string, politeness: Politeness = 'polite') {
    const container = this.shadowRoot?.getElementById(politeness)
    if (!container) {
      throw new Error('Unable to find container for message')
    }

    if (container.textContent === message) {
      container.textContent = `${message}\u00A0`
    } else {
      container.textContent = message
    }
  }
}

export {LiveRegionElement, templateContent}
