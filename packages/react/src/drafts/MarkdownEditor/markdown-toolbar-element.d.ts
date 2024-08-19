type HTMLElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

interface ButtonElements {
  'md-bold': HTMLElementProps
  'md-header': HTMLElementProps
  'md-italic': HTMLElementProps
  'md-quote': HTMLElementProps
  'md-code': HTMLElementProps
  'md-link': HTMLElementProps
  'md-image': HTMLElementProps
  'md-unordered-list': HTMLElementProps
  'md-ordered-list': HTMLElementProps
  'md-task-list': HTMLElementProps
  'md-mention': HTMLElementProps
  'md-ref': HTMLElementProps
}
export type MarkdownToolbarButtonName = keyof ButtonElements

declare global {
  namespace JSX {
    interface IntrinsicElements extends ButtonElements {
      'markdown-toolbar': HTMLElementProps & {
        for: string
        disabled?: boolean
      }
    }
  }
}
