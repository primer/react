const FOCUSABLE_SELECTOR =
  'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

  export function queryFocusable(container: Element): NodeListOf<HTMLElement> {
  return container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
}
