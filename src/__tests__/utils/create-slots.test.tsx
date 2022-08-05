import React from 'react'
import {render} from '@testing-library/react'
import createSlots from '../../utils/create-slots'

describe('createSlots', () => {
  it('moves slot contents to insertion point', () => {
    const {Slots, Slot} = createSlots(['SlotName'])

    const Component = ({children}: {children: React.ReactNode}) => (
      <Slots>
        {slots => (
          <>
            <section aria-label="children">{children}</section>
            <section aria-label="insertion point">{slots.SlotName}</section>
          </>
        )}
      </Slots>
    )

    const {getByRole} = render(
      <Component>
        <Slot name="SlotName">Slot Contents</Slot>Other Contents
      </Component>
    )

    expect(getByRole('region', {name: 'children'})).toHaveTextContent('Other Contents')
    expect(getByRole('region', {name: 'insertion point'})).toHaveTextContent('Slot Contents')
    expect(getByRole('region', {name: 'children'})).not.toHaveTextContent('Slot Contents')
  })

  it('works with multiple slots', () => {
    const {Slots, Slot} = createSlots(['A', 'B'])

    const Component = ({children}: {children: React.ReactNode}) => (
      <Slots>
        {slots => (
          <>
            <section aria-label="children">{children}</section>
            <section aria-label="a">{slots.A}</section>
            <section aria-label="b">{slots.B}</section>
          </>
        )}
      </Slots>
    )

    const {getByRole} = render(
      <Component>
        <Slot name="A">Slot A Contents</Slot>Other Contents<Slot name="B">Slot B Contents</Slot>
      </Component>
    )

    expect(getByRole('region', {name: 'children'})).toHaveTextContent('Other Contents')
    expect(getByRole('region', {name: 'a'})).toHaveTextContent('Slot A Contents')
    expect(getByRole('region', {name: 'b'})).toHaveTextContent('Slot B Contents')
  })
})
