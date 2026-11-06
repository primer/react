import {page} from 'vitest/browser'
import {render} from '@testing-library/react'
import {describe, test, expect} from 'vitest'
import {TopicTagGroup} from './TopicTagGroup'
import {implementsClassName} from '../utils/testing'
import classes from './TopicTagGroup.module.css'

describe('TopicTagGroup', () => {
  implementsClassName(TopicTagGroup, classes.TopicTagGroup)

  test('additional props are applied to outermost element', async () => {
    render(
      <TopicTagGroup data-testid="test" id="test-id">
        test
      </TopicTagGroup>,
    )
    await expect.element(page.getByTestId('test')).toHaveAttribute('data-testid', 'test')
    await expect.element(page.getByTestId('test')).toHaveAttribute('id', 'test-id')
  })
})
