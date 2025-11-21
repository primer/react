import {render, screen} from '@testing-library/react'
import {describe, test, expect, vi} from 'vitest'
import {userEvent} from 'vitest/browser'
import {TopicTag} from '../TopicTag'

describe('TopicTag', () => {
  test('defaults to <a> semantics', async () => {
    const onClick = vi.fn()
    render(
      <TopicTag href="/test" onClick={onClick}>
        test
      </TopicTag>,
    )

    await userEvent.click(screen.getByRole('link', {name: 'test'}))
    expect(onClick).toHaveBeenCalled()
  })

  test('support <button> semantics through `as` prop', async () => {
    const onClick = vi.fn()
    render(
      <TopicTag as="button" onClick={onClick}>
        test
      </TopicTag>,
    )

    await userEvent.click(screen.getByRole('link', {name: 'test'}))
    expect(onClick).toHaveBeenCalled()
  })

  test('supports `className` merging', () => {
    const {container} = render(<TopicTag className="custom-class">test</TopicTag>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  test('additional props are applied to outermost element', () => {
    const {container} = render(
      <TopicTag data-testid="test" id="test-id">
        test
      </TopicTag>,
    )
    expect(container.firstChild).toHaveAttribute('data-testid', 'test')
    expect(container.firstChild).toHaveAttribute('id', 'test-id')
  })
})
