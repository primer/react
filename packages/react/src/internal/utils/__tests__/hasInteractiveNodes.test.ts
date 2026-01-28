import {describe, expect, test} from 'vitest'
import {hasInteractiveNodes} from '../hasInteractiveNodes'

describe('hasInteractiveNodes', () => {
  test('returns false when node is null', () => {
    expect(hasInteractiveNodes(null)).toBe(false)
  })

  test('returns false if there are no interactive nodes', () => {
    const node = document.createElement('div')
    expect(hasInteractiveNodes(node)).toBe(false)
  })

  test('returns true if there are interactive nodes', () => {
    const node = document.createElement('div')
    const button = document.createElement('button')
    node.appendChild(button)

    expect(hasInteractiveNodes(node)).toBe(true)
  })

  test('returns false if the node itself is interactive', () => {
    const node = document.createElement('button')

    expect(hasInteractiveNodes(node)).toBe(false)
  })

  test('returns true if there are nested interactive nodes', () => {
    const node = document.createElement('div')
    const wrapper = document.createElement('div')
    const button = document.createElement('button')
    const span = document.createElement('span')
    wrapper.appendChild(button)
    button.appendChild(span)
    node.appendChild(wrapper)

    expect(hasInteractiveNodes(node)).toBe(true)
  })

  describe('disabled elements', () => {
    test('returns false if the node is disabled', () => {
      const node = document.createElement('button')
      node.disabled = true

      expect(hasInteractiveNodes(node)).toBe(false)
    })

    test('returns false if the child node is disabled', () => {
      const node = document.createElement('div')
      const button = document.createElement('button')
      button.disabled = true
      node.appendChild(button)

      expect(hasInteractiveNodes(node)).toBe(false)
    })
  })

  describe('tabindex handling', () => {
    test('returns true if child node has tabindex="0"', () => {
      const node = document.createElement('div')
      const span = document.createElement('span')
      span.setAttribute('tabindex', '0')
      node.appendChild(span)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('returns false if child node has tabindex="-1"', () => {
      const node = document.createElement('div')
      const span = document.createElement('span')
      span.setAttribute('tabindex', '-1')
      node.appendChild(span)

      expect(hasInteractiveNodes(node)).toBe(false)
    })
  })

  describe('interactive element types', () => {
    test('returns true for anchor with href', () => {
      const node = document.createElement('div')
      const anchor = document.createElement('a')
      anchor.href = 'https://example.com'
      node.appendChild(anchor)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('returns false for anchor without href', () => {
      const node = document.createElement('div')
      const anchor = document.createElement('a')
      node.appendChild(anchor)

      expect(hasInteractiveNodes(node)).toBe(false)
    })

    test('returns true for button', () => {
      const node = document.createElement('div')
      const button = document.createElement('button')
      node.appendChild(button)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('returns true for summary', () => {
      const node = document.createElement('div')
      const summary = document.createElement('summary')
      node.appendChild(summary)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('returns true for select', () => {
      const node = document.createElement('div')
      const select = document.createElement('select')
      node.appendChild(select)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('returns true for input (not hidden)', () => {
      const node = document.createElement('div')
      const input = document.createElement('input')
      input.type = 'text'
      node.appendChild(input)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('returns false for input with type=hidden', () => {
      const node = document.createElement('div')
      const input = document.createElement('input')
      input.type = 'hidden'
      node.appendChild(input)

      expect(hasInteractiveNodes(node)).toBe(false)
    })

    test('returns true for textarea', () => {
      const node = document.createElement('div')
      const textarea = document.createElement('textarea')
      node.appendChild(textarea)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('returns true for audio with controls', () => {
      const node = document.createElement('div')
      const audio = document.createElement('audio')
      audio.controls = true
      node.appendChild(audio)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('returns false for audio without controls', () => {
      const node = document.createElement('div')
      const audio = document.createElement('audio')
      node.appendChild(audio)

      expect(hasInteractiveNodes(node)).toBe(false)
    })

    test('returns true for video with controls', () => {
      const node = document.createElement('div')
      const video = document.createElement('video')
      video.controls = true
      node.appendChild(video)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('returns false for video without controls', () => {
      const node = document.createElement('div')
      const video = document.createElement('video')
      node.appendChild(video)

      expect(hasInteractiveNodes(node)).toBe(false)
    })

    test('returns true for contenteditable element', () => {
      const node = document.createElement('div')
      const editable = document.createElement('div')
      editable.contentEditable = 'true'
      node.appendChild(editable)

      expect(hasInteractiveNodes(node)).toBe(true)
    })
  })

  describe('hidden and inert elements', () => {
    test('returns false for element with hidden attribute', () => {
      const node = document.createElement('div')
      const button = document.createElement('button')
      button.hidden = true
      node.appendChild(button)

      expect(hasInteractiveNodes(node)).toBe(false)
    })

    test('returns false for element with inert attribute', () => {
      const node = document.createElement('div')
      const button = document.createElement('button')
      button.setAttribute('inert', '')
      node.appendChild(button)

      expect(hasInteractiveNodes(node)).toBe(false)
    })
  })

  describe('CSS visibility', () => {
    test('returns false for element with display:none', () => {
      const node = document.createElement('div')
      const button = document.createElement('button')
      button.style.display = 'none'
      node.appendChild(button)
      document.body.appendChild(node)

      expect(hasInteractiveNodes(node)).toBe(false)

      document.body.removeChild(node)
    })

    test('returns false for element with visibility:hidden', () => {
      const node = document.createElement('div')
      const button = document.createElement('button')
      button.style.visibility = 'hidden'
      node.appendChild(button)
      document.body.appendChild(node)

      expect(hasInteractiveNodes(node)).toBe(false)

      document.body.removeChild(node)
    })

    test('returns true for element with visibility:visible', () => {
      const node = document.createElement('div')
      const button = document.createElement('button')
      button.style.visibility = 'visible'
      node.appendChild(button)
      document.body.appendChild(node)

      expect(hasInteractiveNodes(node)).toBe(true)

      document.body.removeChild(node)
    })
  })

  describe('ignoreNodes parameter', () => {
    test('ignores nodes in ignoreNodes array', () => {
      const node = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      node.appendChild(button1)
      node.appendChild(button2)

      expect(hasInteractiveNodes(node, [button1, button2])).toBe(false)
    })

    test('returns true if there are interactive nodes not in ignoreNodes', () => {
      const node = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      node.appendChild(button1)
      node.appendChild(button2)

      expect(hasInteractiveNodes(node, [button1])).toBe(true)
    })

    test('always ignores the node itself', () => {
      const node = document.createElement('button')
      const childButton = document.createElement('button')
      node.appendChild(childButton)

      expect(hasInteractiveNodes(node)).toBe(true)
    })
  })

  describe('performance optimizations', () => {
    test('handles large DOM trees efficiently', () => {
      const node = document.createElement('div')

      // Create a large tree with multiple levels
      for (let i = 0; i < 100; i++) {
        const wrapper = document.createElement('div')
        const span = document.createElement('span')
        wrapper.appendChild(span)
        node.appendChild(wrapper)
      }

      // Add one interactive node at the end
      const button = document.createElement('button')
      node.appendChild(button)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('stops early when first interactive node is found', () => {
      const node = document.createElement('div')

      // Add interactive node at the beginning
      const button = document.createElement('button')
      node.appendChild(button)

      // Add many more elements after
      for (let i = 0; i < 100; i++) {
        const div = document.createElement('div')
        node.appendChild(div)
      }

      expect(hasInteractiveNodes(node)).toBe(true)
    })
  })

  describe('complex scenarios', () => {
    test('handles multiple types of interactive elements', () => {
      const node = document.createElement('div')
      const anchor = document.createElement('a')
      anchor.href = '#'
      const button = document.createElement('button')
      const input = document.createElement('input')

      node.appendChild(anchor)
      node.appendChild(button)
      node.appendChild(input)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('handles deeply nested structure', () => {
      const node = document.createElement('div')
      let current = node

      // Create deep nesting
      for (let i = 0; i < 10; i++) {
        const wrapper = document.createElement('div')
        current.appendChild(wrapper)
        current = wrapper
      }

      // Add button at the deepest level
      const button = document.createElement('button')
      current.appendChild(button)

      expect(hasInteractiveNodes(node)).toBe(true)
    })

    test('correctly handles mix of valid and invalid interactive elements', () => {
      const node = document.createElement('div')

      const disabledButton = document.createElement('button')
      disabledButton.disabled = true

      const hiddenButton = document.createElement('button')
      hiddenButton.hidden = true

      const validButton = document.createElement('button')

      node.appendChild(disabledButton)
      node.appendChild(hiddenButton)
      node.appendChild(validButton)

      expect(hasInteractiveNodes(node)).toBe(true)
    })
  })
})
