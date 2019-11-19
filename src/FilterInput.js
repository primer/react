class FilterInputElement extends HTMLElement {
  static get observedAttributes() {
    return ['aria-owns']
  }

  attributeChangedCallback(name, oldValue) {
    if (oldValue && name === 'aria-owns') {
      filterResults(this, false)
    }
  }

  connectedCallback() {
    const input = this.input
    if (!input) return

    input.setAttribute('autocomplete', 'off')
    input.setAttribute('spellcheck', 'false')

    this.debounceInputChange = debounce(() => filterResults(this))
    this.boundFilterResults = () => filterResults(this)
    input.addEventListener('focus', this.boundFilterResults)
    input.addEventListener('change', this.boundFilterResults)
    input.addEventListener('input', this.debounceInputChange)
  }

  disconnectedCallback() {
    const input = this.input
    if (!input) return

    input.removeEventListener('focus', this.boundFilterResults)
    input.removeEventListener('change', this.boundFilterResults)
    input.removeEventListener('input', this.debounceInputChange)
  }

  get input() {
    const input = this.querySelector('input')
    return input instanceof HTMLInputElement ? input : null
  }

  get ownedElement() {
    return document.getElementById(this.getAttribute('aria-owns') || '')
  }

  reset() {
    const input = this.input
    if (input) {
      input.value = ''
      input.dispatchEvent(new Event('change', {bubbles: true}))
    }
  }
}

async function filterResults(filterInput, checkCurrentQuery = true) {
  const input = filterInput.input
  if (!input) return
  const query = input.value.toLowerCase()
  if (checkCurrentQuery && filterInput.currentQuery === query) return
  filterInput.currentQuery = query
  const container = filterInput.ownedElement
  if (!container) return
  const list = container.hasAttribute('data-filter-list') ? container : container.querySelector('[data-filter-list]')
  if (!list) return

  let count = 0
  const total = list.childElementCount
  let exactMatch = false

  for (const result of list.children) {
    const itemText = getText(result)
    if (itemText === query) {
      result.hidden = false
      exactMatch = true
      count++
    } else {
      const match = itemText.indexOf(query) !== -1
      result.hidden = !match
      if (match) count++
    }
  }

  const newItem = container.querySelector('[data-filter-new-item]')
  const showCreateOption = !!newItem && query.length > 0 && !exactMatch
  if (newItem) {
    newItem.hidden = !showCreateOption
    if (showCreateOption) updateNewItem(newItem, query)
  }

  toggleBlankslate(container, count > 0 || showCreateOption)

  filterInput.dispatchEvent(
    new CustomEvent('filter-input-updated', {
      bubbles: true,
      detail: {
        count,
        total
      }
    })
  )
}

function getText(filterableItem) {
  const target = filterableItem.querySelector('[data-filter-item-text]') || filterableItem
  return target.textContent.trim().toLowerCase()
}

function updateNewItem(newItem, query) {
  const newItemText = newItem.querySelector('[data-filter-new-item-text]')
  if (newItemText) newItemText.textContent = query
  const newItemInput = newItem.querySelector('[data-filter-new-item-value]')
  if (newItemInput instanceof HTMLInputElement) newItemInput.value = query
}

function toggleBlankslate(container, force) {
  const emptyState = container.querySelector('[data-filter-empty-state]')
  if (emptyState) emptyState.hidden = force
}

function debounce(callback) {
  let timeout
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      clearTimeout(timeout)
      callback()
    }, 300)
  }
}

export default FilterInputElement

if (window && window.customElements && !window.customElements.get('filter-input')) {
  window.FilterInputElement = FilterInputElement
  window.customElements.define('filter-input', FilterInputElement)
}
