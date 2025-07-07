import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {ActionList} from '../../deprecated/ActionList'
import {BaseStyles} from '../..'

function SimpleActionList(): JSX.Element {
  return (
    <BaseStyles>
      <ActionList
        items={[
          {text: 'New file'},
          ActionList.Divider,
          {text: 'Copy link'},
          {text: 'Edit file'},
          {text: 'Delete file', variant: 'danger'},
        ]}
      />
    </BaseStyles>
  )
}

describe('ActionList', () => {
  it('renders correctly', () => {
    const {container} = render(<SimpleActionList />)
    expect(container.firstChild).toBeInTheDocument()
  })
})

describe('ActionList.Item', () => {
  it('renders correctly', () => {
    const {container} = render(
      <BaseStyles>
        <ActionList.Item>Test item</ActionList.Item>
      </BaseStyles>,
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
