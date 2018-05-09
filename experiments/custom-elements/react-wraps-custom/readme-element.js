import README from './README.md'

const body = document.createElement('div')
body.classList.add('markdown-body')
body.innerHTML = README
for (const ul of body.querySelectorAll('ul')) {
  ul.classList.add('pl-4')
}

const elementName = 'readme-element'

class ReadmeElement extends HTMLElement {
  constructor() {
    super()
    console.warn('readme-element')
  }

  connectedCallback() {
    this.appendChild(body.cloneNode(true))
  }
}

if (!window.customElements.get(elementName)) {
  window.customElements.define(elementName, ReadmeElement)
}
