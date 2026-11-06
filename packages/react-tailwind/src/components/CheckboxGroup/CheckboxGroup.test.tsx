import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {Checkbox} from '../Checkbox'
import {FormControl} from '../FormControl'
import {CheckboxGroup} from './CheckboxGroup'

const options = (
  <>
    <FormControl>
      <Checkbox value="one" />
      <FormControl.Label>One</FormControl.Label>
    </FormControl>
    <FormControl>
      <Checkbox value="two" />
      <FormControl.Label>Two</FormControl.Label>
    </FormControl>
  </>
)

function WrappedCaption({children}: {children: React.ReactNode}) {
  // eslint-disable-next-line primer-react/direct-slot-children -- a consumer wrapper must still describe the group
  return <CheckboxGroup.Caption>{children}</CheckboxGroup.Caption>
}

describe('CheckboxGroup', () => {
  it('supports controlled values and forwards root props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    const onValueChange = vi.fn()
    render(
      <CheckboxGroup
        ref={ref}
        id="topics"
        className="custom"
        defaultValue={['one']}
        onValueChange={onValueChange}
        data-testid="group"
      >
        <Checkbox name="one" value="one" />
        <Checkbox name="two" value="two" />
      </CheckboxGroup>,
    )
    await user.click(screen.getAllByRole('checkbox')[1])
    expect(onValueChange).toHaveBeenLastCalledWith(['one', 'two'], expect.anything())
    expect(ref.current).toBe(screen.getByTestId('group'))
    expect(ref.current).toHaveAttribute('id', 'topics')
    expect(ref.current).toHaveClass('grid', 'custom')
  })

  it('is named by its label and described by its validation and caption', () => {
    render(
      <CheckboxGroup id="topics">
        <CheckboxGroup.Label>Topics</CheckboxGroup.Label>
        <CheckboxGroup.Caption>Pick any</CheckboxGroup.Caption>
        <CheckboxGroup.Validation variant="error">Pick one</CheckboxGroup.Validation>
        {options}
      </CheckboxGroup>,
    )
    const group = screen.getByRole('group', {name: 'Topics'})
    expect(group).toHaveAttribute('aria-labelledby', 'topics-label')
    expect(group).toHaveAttribute('aria-describedby', 'topics-validation topics-caption')
    expect(group).toHaveAccessibleDescription('Pick one Pick any')
  })

  it('keeps consumer labelling and description ids first', () => {
    render(
      <>
        <h2 id="heading">External</h2>
        <p id="hint">Hint</p>
        <CheckboxGroup aria-labelledby="heading" aria-describedby="hint">
          <CheckboxGroup.Label>Topics</CheckboxGroup.Label>
          <CheckboxGroup.Caption id="custom-caption">Pick any</CheckboxGroup.Caption>
          {options}
        </CheckboxGroup>
      </>,
    )
    const group = screen.getByRole('group', {name: 'External'})
    expect(group).toHaveAttribute('aria-describedby', 'hint custom-caption')
  })

  it('describes the group with a caption rendered through a wrapper', () => {
    render(
      <CheckboxGroup>
        <CheckboxGroup.Label>Topics</CheckboxGroup.Label>
        <WrappedCaption>Pick any</WrappedCaption>
        {options}
      </CheckboxGroup>,
    )
    expect(screen.getByRole('group', {name: 'Topics'})).toHaveAccessibleDescription('Pick any')
  })

  it('falls back to an enclosing FormControl label', () => {
    render(
      <FormControl>
        <FormControl.Label>Topics</FormControl.Label>
        <CheckboxGroup>
          <Checkbox value="one" aria-label="One" />
        </CheckboxGroup>
      </FormControl>,
    )
    expect(screen.getByRole('group', {name: 'Topics'})).toBeInTheDocument()
  })

  it('disables its nested controls and mutes its label', () => {
    render(
      <CheckboxGroup disabled>
        <CheckboxGroup.Label data-testid="label">Topics</CheckboxGroup.Label>
        {options}
      </CheckboxGroup>,
    )
    expect(screen.getByTestId('label')).toHaveAttribute('data-disabled')
    for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).toHaveAttribute('aria-disabled', 'true')
  })

  it('marks the label and describes the group when required', () => {
    render(
      <CheckboxGroup required>
        <CheckboxGroup.Label>Topics</CheckboxGroup.Label>
        <CheckboxGroup.Caption>Pick any</CheckboxGroup.Caption>
        {options}
      </CheckboxGroup>,
    )
    const group = screen.getByRole('group', {name: 'Topics'})
    expect(group).toHaveAccessibleDescription('Pick any Required')
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })
})
