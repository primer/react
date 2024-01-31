import {HTMLElement as SSRHTMLElement, customElements} from '@lit-labs/ssr-dom-shim'
import {canUseDOM} from '../../../../utils/environment'

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
const SafeHTMLElement = canUseDOM ? HTMLElement : SSRHTMLElement

export {SafeHTMLElement as HTMLElement, customElements}
