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
    render(<TopicTag className="custom-class">test</TopicTag>)
    await expect.element(page.getByText('test', {exact: true})).toHaveClass('custom-class')
  })

  test('additional props are applied to outermost element', async () => {
    render(
      <TopicTag data-testid="test" id="test-id">
        test
      </TopicTag>,
    )
    await expect.element(page.getByTestId('test')).toHaveAttribute('data-testid', 'test')
    await expect.element(page.getByTestId('test')).toHaveAttribute('id', 'test-id')
  })
})
