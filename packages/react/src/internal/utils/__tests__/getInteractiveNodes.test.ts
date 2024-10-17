import {getInteractiveNodes} from '../getInteractiveNodes'

describe('getInteractiveNodes', () => {
  test('if there are no interactive nodes', () => {
    const node = document.createElement('div')
    expect(getInteractiveNodes(node)).toBeUndefined()
  })

  test('if there are interactive nodes', () => {
    const node = document.createElement('div')
    const button = document.createElement('button')
    node.appendChild(button)

    expect(getInteractiveNodes(node)).toBe(true)
  })

  test('if the node itself is interactive', () => {
    const node = document.createElement('button')

    expect(getInteractiveNodes(node)).toBe(true)
  })

  test('if there are nested interactive nodes', () => {
    const node = document.createElement('div')
    const wrapper = document.createElement('div')
    const button = document.createElement('button')
    const span = document.createElement('span')
    wrapper.appendChild(button)
    button.appendChild(span)
    node.appendChild(wrapper)

    expect(getInteractiveNodes(node)).toBe(true)
  })

  test('if the node is disabled', () => {
    const node = document.createElement('button')
    node.disabled = true

    expect(getInteractiveNodes(node)).toBeUndefined()
  })

  test('if the child node is disabled', () => {
    const node = document.createElement('div')
    const button = document.createElement('button')
    button.disabled = true
    node.appendChild(button)

    expect(getInteractiveNodes(node)).toBeUndefined()
  })

  test('if child node has tabindex', () => {
    const node = document.createElement('div')
    const span = document.createElement('span')
    span.setAttribute('tabindex', '0')
    node.appendChild(span)

    expect(getInteractiveNodes(node)).toBe(true)
  })
})
