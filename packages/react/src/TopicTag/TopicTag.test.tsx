import {page, userEvent} from 'vitest/browser'
import {render} from '@testing-library/react'
import {describe, test, expect, vi} from 'vitest'
import {TopicTag} from '../TopicTag'
import {implementsClassName} from '../utils/testing'
import classes from './TopicTag.module.css'

describe('TopicTag', () => {
  implementsClassName(TopicTag, classes.TopicTag)

  test('defaults to <a> semantics', async () => {
    render(<TopicTag href="#">test</TopicTag>)

    await expect.element(page.getByRole('link', {name: 'test'})).toBeInTheDocument()
  })

  test('support <button> semantics through `as` prop', async () => {
    const onClick = vi.fn()
    render(
      <TopicTag as="button" onClick={onClick}>
        test
      </TopicTag>,
    )

    await userEvent.click(page.getByRole('button', {name: 'test'}))
    expect(onClick).toHaveBeenCalled()
  })

  test('supports `className` merging', async () => {
    const {container} = render(<TopicTag className="custom-class">test</TopicTag>)
    const topicTag = page.getByText('test', {exact: true})
    expect(topicTag.element()).toBe(container.firstElementChild)
    await expect.element(topicTag).toHaveClass('custom-class')
  })

  test('additional props are applied to outermost element', async () => {
    const {container} = render(
      <TopicTag data-testid="test" id="test-id">
        test
      </TopicTag>,
    )
    const topicTag = page.getByTestId('test')
    expect(topicTag.element()).toBe(container.firstElementChild)
    await expect.element(topicTag).toHaveAttribute('data-testid', 'test')
    await expect.element(topicTag).toHaveAttribute('id', 'test-id')
  })
})
