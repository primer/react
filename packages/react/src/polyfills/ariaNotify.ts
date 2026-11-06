import '@github/arianotify-polyfill'

type AriaNotifyOptions = {
  priority?: 'normal' | 'high'
}

declare global {
  interface Document {
    ariaNotify(announcement: string, options?: AriaNotifyOptions): void
  }

  interface Element {
    ariaNotify(announcement: string, options?: AriaNotifyOptions): void
  }
}

export type {AriaNotifyOptions}
