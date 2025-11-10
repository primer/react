import {render} from '@testing-library/react'
import {describe, test, expect} from 'vitest'
import {TopicTag} from '../TopicTag'
import {page} from 'vitest/browser'

describe('TopicTag', () => {
  test('supports `className` merging', () => {
    const {container} = render(<TopicTag className="custom-class">test</TopicTag>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  test('additional props are supplied to outermost element', () => {
    const {container} = render(
      <TopicTag data-testid="test" id="test-id">
        test
      </TopicTag>,
    )
    expect(container).toHaveAttribute('data-testid', 'test')
    expect(container).toHaveAttribute('id', 'test-id')
  })
})
