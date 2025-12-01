import {render} from '@testing-library/react'
import {describe, test, expect} from 'vitest'
import {TopicTagGroup} from './TopicTagGroup'

describe('TopicTagGroup', () => {
  test('supports `className` merging', () => {
    const {container} = render(<TopicTagGroup className="custom-class">test</TopicTagGroup>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  test('additional props are applied to outermost element', () => {
    const {container} = render(
      <TopicTagGroup data-testid="test" id="test-id">
        test
      </TopicTagGroup>,
    )
    expect(container.firstChild).toHaveAttribute('data-testid', 'test')
    expect(container.firstChild).toHaveAttribute('id', 'test-id')
  })
})
