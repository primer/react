import {LiveRegionElement} from './element'

// Note: this call is replaced in "node" entrypoints
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
customElements.define('live-region', LiveRegionElement)
