declare module '@koddsson/textarea-caret' {
  export interface CaretCoordinates {
    top: number
    left: number
    height: number
  }
  export default function getCaretCoordinates(
    input: HTMLTextAreaElement | HTMLInputElement,
    index: number
  ): CaretCoordinates
}
