import {LiveRegionElement} from './element'
import {customElements} from './ssr-dom-shim'

// Note: this call is replaced in "node" entrypoints
customElements.define('live-region', LiveRegionElement)
