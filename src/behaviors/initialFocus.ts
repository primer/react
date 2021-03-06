import { iterateTabbableElements } from "../utils/iterateTabbable"

export type UseInitialFocusProps = {
  initialFocusElement?: HTMLElement | null
  containerElement: HTMLElement | null
}

// note: I had to pass | null in to the element types because useProvidedRefOrCreate could return a ref that doesn't have current on it. I'm not sure if this is the correct approach or not

export function initialFocus({initialFocusElement, containerElement}: UseInitialFocusProps): void  {
  if (initialFocusElement) {
    initialFocusElement.focus()
  } else if (containerElement instanceof HTMLElement) {
    const firstItem = iterateTabbableElements(containerElement).next().value
    firstItem?.focus()
  }
}