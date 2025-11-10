import {render, screen} from '@testing-library/react'
import {describe, test, expect, vi} from 'vitest'
import {userEvent} from 'vitest/browser'
import {TopicTag} from '../TopicTag'

describe('TopicTag', () => {
  test('defaults to <button> semantics', async () => {
    const onClick = vi.fn()
    render(<TopicTag onClick={onClick}>test</TopicTag>)

    await userEvent.click(screen.getByRole('button', {name: 'test'}))
    expect(onClick).toHaveBeenCalled()
  })

  test('support <a> semantics through `href` prop', async () => {
    const onClick = vi.fn()
    render(
      <TopicTag as="a" href="#test" onClick={onClick}>
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

  test('additional props are supplied to outermost element', () => {
    const {container} = render(
      <TopicTag data-testid="test" id="test-id">
        test
      </TopicTag>,
    )
    expect(container.firstChild).toHaveAttribute('data-testid', 'test')
    expect(container.firstChild).toHaveAttribute('id', 'test-id')
  })
})
