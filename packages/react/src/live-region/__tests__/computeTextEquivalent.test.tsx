import {computeTextEquivalent} from '../computeTextEquivalent'

describe('computeTextEquivalent', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('Text', () => {
    expect(computeTextEquivalent(new Text('test'))).toEqual('test')
  })

  test('HTMLElement', () => {
    const element = document.createElement('div')

    expect(computeTextEquivalent(element)).toEqual('')

    element.textContent = 'test'
    expect(computeTextEquivalent(element)).toEqual('test')
  })

  test('HTMLElement with children', () => {
    const element = document.createElement('div')
    element.innerHTML = `<div>test</div>`

    expect(computeTextEquivalent(element)).toEqual('test')
  })

  test('HTMLElement with text and element children', () => {
    const element = document.createElement('div')
    element.innerHTML = `before <div>test</div> after`

    expect(computeTextEquivalent(element)).toEqual('before test after')
  })

  test('HTMLElement with aria-label', () => {
    const element = document.createElement('div')
    element.setAttribute('aria-label', 'test')
    expect(computeTextEquivalent(element)).toEqual('test')
  })

  test('HTMLElement with aria-labelledby', () => {
    const label = document.createElement('div')
    label.textContent = 'test'
    label.id = 'label'

    const element = document.createElement('div')
    element.setAttribute('aria-labelledby', 'label')

    document.body.appendChild(label)
    document.body.appendChild(element)

    expect(computeTextEquivalent(element)).toEqual('test')
  })

  test('HTMLElement with aria-labelledby but no node with id', () => {
    const element = document.createElement('div')
    element.setAttribute('aria-labelledby', 'label')

    document.body.appendChild(element)

    expect(computeTextEquivalent(element)).toEqual('')
  })

  test('HTMLElement with aria-labelledby with node that is aria-hidden="true"', () => {
    const label = document.createElement('div')
    label.textContent = 'test'
    label.id = 'label'
    label.setAttribute('aria-hidden', 'true')

    const element = document.createElement('div')
    element.setAttribute('aria-labelledby', 'label')

    document.body.appendChild(label)
    document.body.appendChild(element)

    expect(computeTextEquivalent(element)).toEqual('test')
  })

  test('HTMLElement with aria-labelledby that points to multiple nodes', () => {
    const label1 = document.createElement('div')
    label1.textContent = 'test1'
    label1.id = 'label1'

    const label2 = document.createElement('div')
    label2.textContent = 'test2'
    label2.id = 'label2'

    const element = document.createElement('div')
    element.setAttribute('aria-labelledby', 'label1 label2')

    document.body.appendChild(label1)
    document.body.appendChild(label2)
    document.body.appendChild(element)

    expect(computeTextEquivalent(element)).toEqual('test1 test2')
  })

  test('HTMLElement with aria-hidden', () => {
    const element = document.createElement('div')
    element.setAttribute('aria-hidden', 'true')
    element.textContent = 'test'
    expect(computeTextEquivalent(element)).toEqual('')
  })

  test('HTMLElement with aria-hidden and allowAriaHidden', () => {
    const element = document.createElement('div')
    element.setAttribute('aria-hidden', 'true')
    element.textContent = 'test'
    expect(computeTextEquivalent(element, {allowAriaHidden: true})).toEqual('test')
  })

  test('HTMLElement with display: none', () => {
    const element = document.createElement('div')
    element.style.display = 'none'
    element.textContent = 'test'
    expect(computeTextEquivalent(element)).toEqual('')
  })

  test('HTMLElement with visibility: hidden', () => {
    const element = document.createElement('div')
    element.style.visibility = 'hidden'
    element.textContent = 'test'
    expect(computeTextEquivalent(element)).toEqual('')
  })

  test('HTMLElement with shadowRoot', () => {
    const element = document.createElement('div')
    const shadowRoot = element.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = 'shadow'
    expect(computeTextEquivalent(element)).toEqual('shadow')
  })

  test('HTMLElement with shadowRoot', () => {
    const element = document.createElement('div')
    const shadowRoot = element.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = 'shadow'
    expect(computeTextEquivalent(element)).toEqual('shadow')
  })

  test('HTMLElement with shadowRoot and internal id', () => {
    const element = document.createElement('div')
    const shadowRoot = element.attachShadow({mode: 'open'})

    const label = document.createElement('div')
    label.textContent = 'shadow test'
    label.id = 'label'
    shadowRoot.appendChild(label)

    const childElement = document.createElement('div')
    childElement.setAttribute('aria-labelledby', 'label')
    shadowRoot.appendChild(childElement)

    expect(computeTextEquivalent(element)).toEqual('shadow test')
  })
})
