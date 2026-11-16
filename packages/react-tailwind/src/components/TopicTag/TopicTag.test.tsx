import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {TopicTag, TopicTagGroup} from './TopicTag'
it('renders topic links and groups', () => {
  render(
    <TopicTagGroup>
      <TopicTag href="/topics/react">react</TopicTag>
    </TopicTagGroup>,
  )
  expect(screen.getByRole('link', {name: 'react'})).toHaveAttribute('data-component', 'TopicTag')
  expect(screen.getByText('react').parentElement).toHaveAttribute('data-component', 'TopicTagGroup')
})
