import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {FormControl} from '../FormControl'
import {Radio} from '../Radio'
import {RadioGroup} from './RadioGroup'

describe('RadioGroup', () => {
  it('uses Base UI roving focus and forwards rest props and refs', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <RadioGroup ref={ref} name="view" defaultValue="grid" data-testid="group">
        <Radio value="list" />
        <Radio value="grid" />
      </RadioGroup>,
    )
    expect(screen.getByRole('radio', {checked: true})).toBe(screen.getAllByRole('radio')[1])
    expect(ref.current).toBe(screen.getByTestId('group'))
  })

  it('removes radios from the tab order when an enclosing FormControl disables the group', () => {
    render(
      <FormControl disabled>
        <RadioGroup name="view" defaultValue="grid">
          <Radio value="list" />
          <Radio value="grid" />
        </RadioGroup>
      </FormControl>,
    )
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true')
    for (const radio of screen.getAllByRole('radio')) expect(radio).toHaveAttribute('tabindex', '-1')
  })

  it('honors element and function render props', () => {
    const ref = React.createRef<HTMLDivElement>()
    const {rerender} = render(
      <RadioGroup ref={ref} name="view" render={<fieldset data-testid="fieldset" />}>
        <Radio value="list" />
      </RadioGroup>,
    )
    expect(ref.current).toBe(screen.getByTestId('fieldset'))
    expect(screen.getByTestId('fieldset')).toHaveAttribute('data-component', 'RadioGroup')
    expect(screen.getByTestId('fieldset')).toContainElement(screen.getByRole('radio'))

    rerender(
      <RadioGroup
        disabled
        name="view"
        render={(props, state) => <section {...props} data-testid="section" data-state={String(state.disabled)} />}
      >
        <Radio value="list" />
      </RadioGroup>,
    )
    expect(screen.getByTestId('section')).toHaveAttribute('data-state', 'true')
    expect(screen.getByRole('radio')).toHaveAttribute('tabindex', '-1')
  })

  describe('RadioGroup labelling', () => {
    it('is named by its label and described by its validation and caption', () => {
      render(
        <RadioGroup id="view" name="view">
          <RadioGroup.Label>View</RadioGroup.Label>
          <RadioGroup.Caption>Pick one</RadioGroup.Caption>
          <RadioGroup.Validation variant="success">Saved</RadioGroup.Validation>
          <FormControl>
            <Radio value="list" />
            <FormControl.Label>List</FormControl.Label>
          </FormControl>
        </RadioGroup>,
      )
      const group = screen.getByRole('radiogroup', {name: 'View'})
      expect(group).toHaveAttribute('aria-describedby', 'view-validation view-caption')
      expect(group).toHaveAccessibleDescription('Saved Pick one')
    })

    it('announces required with aria-required and keeps the marker visual', () => {
      render(
        <RadioGroup name="view" required>
          <RadioGroup.Label>View</RadioGroup.Label>
          <Radio value="list" aria-label="List" />
        </RadioGroup>,
      )
      const group = screen.getByRole('radiogroup', {name: 'View'})
      expect(group).toHaveAttribute('aria-required', 'true')
      expect(group).not.toHaveAccessibleDescription()
      expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    })

    it('disables nested FormControls and mutes the label and leading visual', () => {
      render(
        <RadioGroup name="view" disabled>
          <RadioGroup.Label data-testid="label">View</RadioGroup.Label>
          <FormControl>
            <Radio value="list" />
            <FormControl.LeadingVisual data-testid="visual">
              <svg aria-hidden="true" />
            </FormControl.LeadingVisual>
            <FormControl.Label>List</FormControl.Label>
          </FormControl>
        </RadioGroup>,
      )
      expect(screen.getByTestId('label')).toHaveAttribute('data-disabled')
      expect(screen.getByTestId('visual')).toHaveAttribute('data-control-disabled', 'true')
      expect(screen.getByRole('radio', {name: 'List'})).toHaveAttribute('aria-disabled', 'true')
    })
  })
})
