import {HTMLElement} from './ssr-dom-shim'

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

class LiveRegionElement extends HTMLElement {
  #pending: boolean
  #queue: Array<{
    data: readonly [string, AnnounceOptions]
    cancel: Cancelable
  }>
  #timeoutId: number | null

  constructor() {
    super()

    this.#pending = false
    this.#queue = []
    this.#timeoutId = null

    if (!this.shadowRoot) {
      const template = getTemplate()
      const shadowRoot = this.attachShadow({mode: 'open'})
      shadowRoot.appendChild(template.content.cloneNode(true))
    }
  }

  connectedCallback() {
    this.#processQueue()
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

    item.cancel = () => {
      if (this.#timeoutId !== null) {
        clearTimeout(this.#timeoutId)
      }
    }

    this.#timeoutId = window.setTimeout(() => {
      this.#timeoutId = null
      this.setMessage(message, politeness)
      this.#pending = false
      this.#processQueue()
    }, delayMs)
  }

  /**
   * Announce a message with the given politeness level through a corresponding
   * live region
   */
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

  /**
   * Announce a message with the given politeness level from the contents of an
   * element
   */
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

  setMessage = throttle((message: string, politeness: Politeness = 'polite') => {
    const container = this.shadowRoot?.getElementById(politeness)
    if (!container) {
      throw new Error('Unable to find container for message')
    }

    if (container.textContent === message) {
      container.textContent = `${message}\u00A0`
    } else {
      container.textContent = message
    }
  })

  /**
   * Clear all pending messages, preventing them from being announced
   */
  clear() {
    if (this.#timeoutId !== null) {
      clearTimeout(this.#timeoutId)
      this.#timeoutId = null
    }

    this.#queue.length = 0
    this.#pending = false
    this.setMessage.clear()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle<F extends (...args: Array<any>) => void>(callback: F, delayMs = 250) {
  const calls: Array<Parameters<F>> = []
  let timeoutId: number | null = null

  function loop() {
    if (timeoutId !== null) {
      return
    }

    if (calls.length === 0) {
      return
    }

    // We check the length of `calls` above before using `.shift()` to ensure
    // that there is an element in the array.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const args = calls.shift()!
    callback(...args)

    timeoutId = window.setTimeout(() => {
      timeoutId = null
      loop()
    }, delayMs)
  }

  function throttled(...args: Parameters<F>) {
    calls.push(args)
    loop()
  }

  throttled.clear = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    calls.length = 0
  }

  return throttled
}

export {LiveRegionElement, templateContent}
