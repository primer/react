/* eslint-disable-next-line eslint-comments/no-use */
/* eslint-disable ssr-friendly/no-dom-globals-in-module-scope */

import {DynamicListElement} from './dynamic-list-element'
import {DynamicListItemElement} from './dynamic-list-item-element'
import {DynamicListTriggerElement} from './dynamic-list-trigger-element'

declare global {
  interface HTMLElementTagNameMap {
    'dynamic-list': DynamicListElement
    'dynamic-list-item': DynamicListItemElement
    'dynamic-list-trigger': DynamicListTriggerElement
  }
}

if (!customElements.get('dynamic-list')) {
  customElements.define('dynamic-list', DynamicListElement)
}

if (!customElements.get('dynamic-list-item')) {
  customElements.define('dynamic-list-item', DynamicListItemElement)
}

if (!customElements.get('dynamic-list-trigger')) {
  customElements.define('dynamic-list-trigger', DynamicListTriggerElement)
}
