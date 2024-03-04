import React, {forwardRef, useImperativeHandle, useRef, useEffect} from 'react'

export type FormattingTools = {
  header: () => void
  bold: () => void
  italic: () => void
  quote: () => void
  code: () => void
  link: () => void
  unorderedList: () => void
  orderedList: () => void
  taskList: () => void
  mention: () => void
  reference: () => void
}

let hasRegisteredToolbarElement = false

/**
 * Renders an invisible `markdown-toolbar-element` that provides formatting actions to the
 * editor. This is a hacky way of using the library, but it allows us to use the built-in
 * behavior without having to actually display the inflexible toolbar element. It also means
 * we can still use the formatting tools even if the consumer hides the default toolbar
 * buttons (ie, by keyboard shortcut).
 */
export const FormattingTools = forwardRef<FormattingTools, {forInputId: string}>(({forInputId}, forwadedRef) => {
  useEffect(() => {
    // requiring this module will register the custom element; we don't want to do that until the component mounts in the DOM
    if (!hasRegisteredToolbarElement) require('@github/markdown-toolbar-element')
    hasRegisteredToolbarElement = true
  }, [])

  const headerRef = useRef<HTMLElement>(null)
  const boldRef = useRef<HTMLElement>(null)
  const italicRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLElement>(null)
  const codeRef = useRef<HTMLElement>(null)
  const linkRef = useRef<HTMLElement>(null)
  const unorderedListRef = useRef<HTMLElement>(null)
  const orderedListRef = useRef<HTMLElement>(null)
  const taskListRef = useRef<HTMLElement>(null)
  const mentionRef = useRef<HTMLElement>(null)
  const referenceRef = useRef<HTMLElement>(null)

  useImperativeHandle(forwadedRef, () => ({
    header: () => headerRef.current?.click(),
    bold: () => boldRef.current?.click(),
    italic: () => italicRef.current?.click(),
    quote: () => quoteRef.current?.click(),
    code: () => codeRef.current?.click(),
    link: () => linkRef.current?.click(),
    unorderedList: () => unorderedListRef.current?.click(),
    orderedList: () => orderedListRef.current?.click(),
    taskList: () => taskListRef.current?.click(),
    mention: () => mentionRef.current?.click(),
    reference: () => referenceRef.current?.click(),
  }))

  return (
    <markdown-toolbar for={forInputId} style={{display: 'none'}}>
      <md-header ref={headerRef} />
      <md-bold ref={boldRef} />
      <md-italic ref={italicRef} />
      <md-quote ref={quoteRef} />
      <md-code ref={codeRef} />
      <md-link ref={linkRef} />
      <md-unordered-list ref={unorderedListRef} />
      <md-ordered-list ref={orderedListRef} />
      <md-task-list ref={taskListRef} />
      <md-mention ref={mentionRef} />
      <md-ref ref={referenceRef} />
    </markdown-toolbar>
  )
})
