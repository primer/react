export type UseInitialFocusProps = {
  initialFocusElement?: HTMLElement
  containerElement: HTMLElement
  isOpen: boolean
}


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

export const useInitialFocus = ({initialFocusElement, containerElement, isOpen}: UseInitialFocusProps) => {
  if (isOpen && initialFocusElement) {
    initialFocusElement.focus()
  } else {
    const firstItem = getFirstFocusableItem(containerElement)
    firstItem ? firstItem.focus() : null
  }
}