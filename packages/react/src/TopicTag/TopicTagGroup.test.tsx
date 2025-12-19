import {render} from '@testing-library/react'
import {describe, test, expect} from 'vitest'
import {TopicTagGroup} from './TopicTagGroup'
import {implementsClassName} from '../utils/testing'
import classes from './TopicTagGroup.module.css'

describe('TopicTagGroup', () => {
  implementsClassName(TopicTagGroup, classes.TopicTagGroup)

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
