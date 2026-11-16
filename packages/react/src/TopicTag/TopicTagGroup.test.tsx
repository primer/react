import {page} from 'vitest/browser'
import {render} from '@testing-library/react'
import {describe, test, expect} from 'vitest'
import {TopicTagGroup} from './TopicTagGroup'
import {implementsClassName} from '../utils/testing'
import classes from './TopicTagGroup.module.css'

describe('TopicTagGroup', () => {
  implementsClassName(TopicTagGroup, classes.TopicTagGroup)

  test('additional props are applied to outermost element', async () => {
    const {container} = render(
      <TopicTagGroup data-testid="test" id="test-id">
        test
      </TopicTagGroup>,
    )
    const topicTagGroup = page.getByTestId('test')
    expect(topicTagGroup.element()).toBe(container.firstElementChild)
    await expect.element(topicTagGroup).toHaveAttribute('data-testid', 'test')
    await expect.element(topicTagGroup).toHaveAttribute('id', 'test-id')
  })
})
