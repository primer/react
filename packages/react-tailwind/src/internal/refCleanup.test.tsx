import React from 'react'
import {cleanup, render} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {Autocomplete} from '../components/Autocomplete'
import {Checkbox} from '../components/Checkbox'
import {Dialog} from '../components/Dialog'
import {LabelGroup} from '../components/LabelGroup'
import {PageLayout} from '../components/PageLayout'
import {Portal} from '../components/Portal'
import {Radio} from '../components/Radio'
import {RelativeTime} from '../components/RelativeTime'
import {ScrollableRegion} from '../components/ScrollableRegion'
import {Select} from '../components/Select'
import {Textarea} from '../components/Textarea'
import {TextInput} from '../components/TextInput'
import {ToggleSwitch} from '../components/ToggleSwitch'

afterEach(cleanup)

describe('forwarded callback ref cleanup', () => {
  const fixtures: Array<[string, (ref: React.RefCallback<HTMLElement>) => React.ReactElement]> = [
    ['TextInput', ref => <TextInput aria-label="Text" ref={ref} />],
    [
      'Autocomplete.Input',
      ref => (
        <Autocomplete items={['Apple']}>
          <Autocomplete.Input aria-label="Fruit" ref={ref} />
        </Autocomplete>
      ),
    ],
    ['Textarea', ref => <Textarea aria-label="Text" ref={ref} />],
    [
      'Select',
      ref => (
        <Select aria-label="Choice" ref={ref}>
          <option value="one">One</option>
        </Select>
      ),
    ],
    ['Checkbox', ref => <Checkbox aria-label="Choice" ref={ref} />],
    ['Radio', ref => <Radio aria-label="Choice" ref={ref} value="one" />],
    ['ToggleSwitch', ref => <ToggleSwitch aria-label="Choice" ref={ref} />],
    ['Portal', ref => <Portal ref={ref}>Portal content</Portal>],
    ['ScrollableRegion', ref => <ScrollableRegion aria-label="Content" ref={ref} />],
    ['RelativeTime', ref => <RelativeTime datetime="2024-01-01T00:00:00Z" format="datetime" ref={ref} />],
    ['Dialog.Body', ref => <Dialog.Body ref={ref}>Dialog content</Dialog.Body>],
    [
      'LabelGroup',
      ref => (
        <LabelGroup ref={ref}>
          <span>Label</span>
        </LabelGroup>
      ),
    ],
    [
      'PageLayout.Pane',
      ref => (
        <PageLayout>
          <PageLayout.Pane ref={ref}>Pane content</PageLayout.Pane>
        </PageLayout>
      ),
    ],
  ]

  it.each(fixtures)('%s calls the cleanup returned for every ref attachment', (_name, fixture) => {
    const refCleanup = vi.fn()
    const callback = vi.fn((node: HTMLElement | null) => (node ? refCleanup : undefined))
    const {rerender, unmount} = render(fixture(callback))
    expect(callback.mock.calls.some(([node]) => node instanceof HTMLElement)).toBe(true)

    rerender(fixture(callback))
    unmount()

    expect(callback).not.toHaveBeenCalledWith(null)
    expect(refCleanup).toHaveBeenCalledTimes(callback.mock.calls.length)
  })

  it('cleans up a replaced TextInput ref and preserves ordinary callback and object refs', () => {
    const firstCleanup = vi.fn()
    const firstRef = vi.fn((node: HTMLInputElement | null) => (node ? firstCleanup : undefined))
    const secondCleanup = vi.fn()
    const secondRef = vi.fn((node: HTMLInputElement | null) => (node ? secondCleanup : undefined))
    const ordinaryRef = vi.fn()
    const objectRef = React.createRef<HTMLInputElement>()
    const {rerender, unmount} = render(<TextInput ref={firstRef} />)

    rerender(<TextInput ref={secondRef} />)
    expect(firstCleanup).toHaveBeenCalledOnce()
    expect(firstRef).not.toHaveBeenCalledWith(null)

    rerender(<TextInput ref={ordinaryRef} />)
    expect(secondCleanup).toHaveBeenCalledOnce()
    expect(secondRef).not.toHaveBeenCalledWith(null)

    rerender(<TextInput ref={objectRef} />)
    expect(ordinaryRef).toHaveBeenLastCalledWith(null)
    expect(objectRef.current).toBeInstanceOf(HTMLInputElement)
    unmount()
    expect(objectRef.current).toBeNull()
  })

  it('runs TextInput ref cleanups across StrictMode reattachment', () => {
    const refCleanup = vi.fn()
    const callback = vi.fn((node: HTMLInputElement | null) => (node ? refCleanup : undefined))
    const {unmount} = render(
      <React.StrictMode>
        <TextInput ref={callback} />
      </React.StrictMode>,
    )

    expect(callback.mock.calls.length).toBeGreaterThan(1)
    expect(refCleanup).toHaveBeenCalledTimes(callback.mock.calls.length - 1)
    unmount()
    expect(callback).not.toHaveBeenCalledWith(null)
    expect(refCleanup).toHaveBeenCalledTimes(callback.mock.calls.length)
  })
})
