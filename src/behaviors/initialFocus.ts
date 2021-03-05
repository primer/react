export type UseInitialFocusProps = {
  initialFocusElement?: HTMLElement | null
  containerElement: HTMLElement | null
}

// note: I had to pass | null in to the element types because useProvidedRefOrCreate could return a ref that doesn't have current on it. I'm not sure if this is the correct approach or not


function visible(el: HTMLInputElement) {
  return !el.hidden && (!el.type || el.type !== 'hidden') && (el.offsetWidth > 0 || el.offsetHeight > 0)
}

function focusable(el: HTMLElement) {
  const inputEl = el as HTMLInputElement
  return inputEl.tabIndex >= 0 && !inputEl.disabled && visible(inputEl)
}


function getFirstFocusableItem(containerElement: HTMLElement){
  let firstItem = null
  const items = Array.from(containerElement.querySelectorAll<HTMLElement>('*')).filter(focusable)
  if (items.length === 0) return
  firstItem = items[0]
  return firstItem as HTMLElement
}

export function initialFocus({initialFocusElement, containerElement}: UseInitialFocusProps): void  {
  if (initialFocusElement) {
    initialFocusElement.focus()
  } else if (containerElement instanceof HTMLElement) {
    const firstItem = getFirstFocusableItem(containerElement)
    firstItem ? firstItem.focus() : null
  }
}