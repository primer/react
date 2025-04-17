type TextEquivalentOptions = {
  allowAriaHidden: boolean
}

const defaultOptions: TextEquivalentOptions = {
  allowAriaHidden: false,
}

/**
 * Simplified version of the algorithm to compute the text equivalent of an
 * element. We do not include support for getting the text equivalence for
 * various roles
 *
 * @see https://www.w3.org/TR/accname-1.2/#computation-steps
 */
function computeTextEquivalent(
  elementOrText: HTMLElement | Text,
  options: TextEquivalentOptions = defaultOptions,
  parentShadowRoot?: ShadowRoot,
): string {
  if (elementOrText instanceof HTMLElement && elementOrText.shadowRoot) {
    const shadowRoot = elementOrText.shadowRoot!
    return Array.from(elementOrText.shadowRoot.childNodes)
      .map(node => {
        if (node instanceof Text) {
          return computeTextEquivalent(node, options, shadowRoot)
        }

        if (node instanceof HTMLElement) {
          return computeTextEquivalent(node, options, shadowRoot)
        }

        return null
      })
      .filter(Boolean)
      .join(' ')
  }

  if (elementOrText instanceof Text) {
    return elementOrText.textContent?.trim() ?? ''
  }

  const style = window.getComputedStyle(elementOrText)
  if (style.display === 'none' || style.visibility === 'hidden') {
    return ''
  }

  if (options.allowAriaHidden === false && elementOrText.getAttribute('aria-hidden') === 'true') {
    return ''
  }

  if (elementOrText.hasAttribute('aria-labelledby')) {
    const idrefs = elementOrText.getAttribute('aria-labelledby')!
    const context = parentShadowRoot ?? document
    return idrefs
      .split(' ')
      .map(idref => {
        const item = context.getElementById(idref)
        if (item) {
          return computeTextEquivalent(item, {allowAriaHidden: true})
        }
        return null
      })
      .filter(Boolean)
      .join(' ')
  }

  if (elementOrText.hasAttribute('aria-label')) {
    return elementOrText.getAttribute('aria-label')!.trim()
  }

  if (elementOrText.childNodes.length > 0) {
    return Array.from(elementOrText.childNodes)
      .map(node => {
        if (node instanceof Text || node instanceof HTMLElement) {
          return computeTextEquivalent(node, options)
        }
        return null
      })
      .filter(Boolean)
      .join(' ')
  }

  return elementOrText.textContent?.trim() ?? ''
}

export {computeTextEquivalent}
