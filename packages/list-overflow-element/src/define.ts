import {ListOverflowElement} from './list-overflow-element'

declare global {
  interface HTMLElementTagNameMap {
    'list-overflow': ListOverflowElement
  }
}

if (!customElements.get('list-overflow')) {
  customElements.define('list-overflow', ListOverflowElement)
}
