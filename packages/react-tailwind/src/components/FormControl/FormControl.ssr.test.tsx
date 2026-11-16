// @vitest-environment node
import type React from 'react'
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {Checkbox} from '../Checkbox'
import {Radio} from '../Radio'
import {RadioGroup} from '../RadioGroup'
import {ToggleSwitch} from '../ToggleSwitch'
import {FormControl} from './FormControl'

describe('FormControl on the server', () => {
  it('renders an independently associated error before hydration', () => {
    const html = renderToString(
      <>
        <label htmlFor="description">Description</label>
        <textarea id="description" aria-invalid="true" aria-describedby="description-error" />
        <FormControl.Validation id="description-error" variant="error">
          Enter a description.
        </FormControl.Validation>
      </>,
    )

    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain('aria-describedby="description-error"')
    expect(html).toContain('id="description-error"')
  })

  it('associates a native label with its control before hydration', () => {
    const html = renderToString(
      <FormControl id="server-field" required>
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
        <FormControl.Caption>Help text</FormControl.Caption>
      </FormControl>,
    )

    expect(html).toContain('for="server-field"')
    expect(html).toMatch(/<input[^>]*\sid="server-field"/)
    expect(html).toMatch(/<input[^>]*\srequired=""/)
    expect(html).toContain('aria-describedby="server-field-caption"')
  })

  it('uses an explicit control id in server-rendered labels and descriptions', () => {
    const html = renderToString(
      <FormControl id="field-id">
        <FormControl.Label>Repository</FormControl.Label>
        <>
          <FormControl.Control id="control-id" />
        </>
        <FormControl.Caption>Help text</FormControl.Caption>
      </FormControl>,
    )

    expect(html).toContain('for="control-id"')
    expect(html).toMatch(/<input[^>]*\sid="control-id"/)
    expect(html).toContain('aria-describedby="control-id-caption"')
  })

  it('uses the id of a control inside a DOM wrapper before hydration', () => {
    const html = renderToString(
      <FormControl id="field-id">
        <FormControl.Label>Repository</FormControl.Label>
        <div>
          <FormControl.Control id="control-id" />
        </div>
        <FormControl.Caption>Help text</FormControl.Caption>
      </FormControl>,
    )

    expect(html).toContain('for="control-id"')
    expect(html).toMatch(/<input[^>]*\sid="control-id"/)
    expect(html).toContain('aria-describedby="control-id-caption"')
  })

  it('omits description references when region props do not render a target', () => {
    const html = renderToString(
      <FormControl id="field-id" caption={false} validation={[]}>
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
        <FormControl.Caption>Previous caption</FormControl.Caption>
        <FormControl.Validation variant="error">Previous error</FormControl.Validation>
      </FormControl>,
    )

    expect(html).not.toContain('aria-describedby')
    expect(html).not.toContain('Previous caption')
    expect(html).not.toContain('Previous error')
  })

  it('associates text and identified custom description content before hydration', () => {
    const html = renderToString(
      <FormControl id="field-id" caption="Help text" validation={<span id="custom-error">Error text</span>}>
        <FormControl.Label>Repository</FormControl.Label>
        <FormControl.Control />
      </FormControl>,
    )

    expect(html).toContain('aria-describedby="custom-error field-id-caption"')
    expect(html).toContain('id="field-id-caption"')
    expect(html).toContain('id="custom-error"')
  })

  it('uses a wrapped label id for a checkbox before hydration', () => {
    function WrappedLabel({id}: {id: string}) {
      // The region prop deliberately supports wrappers around FormControl parts.
      // eslint-disable-next-line primer-react/direct-slot-children
      return <FormControl.Label id={id}>Notifications</FormControl.Label>
    }

    const html = renderToString(
      <FormControl label={<WrappedLabel id="notifications-label" />}>
        <Checkbox />
      </FormControl>,
    )

    expect(html).toMatch(/<label[^>]*\sid="notifications-label"/)
    expect(html).toMatch(/role="checkbox"[^>]*aria-labelledby="notifications-label"/)
  })

  it('associates fragment-wrapped region props before hydration', () => {
    const html = renderToString(
      <FormControl
        label={
          <>
            <FormControl.Label id="notifications-label">Notifications</FormControl.Label>
          </>
        }
        caption={
          <>
            <FormControl.Caption id="notifications-caption">Help text</FormControl.Caption>
          </>
        }
        validation={
          <>
            <FormControl.Validation id="notifications-error" variant="error">
              Error text
            </FormControl.Validation>
          </>
        }
      >
        <Checkbox />
      </FormControl>,
    )

    expect(html).toMatch(/role="checkbox"[^>]*aria-labelledby="notifications-label"/)
    expect(html).toContain('aria-describedby="notifications-error notifications-caption"')
    expect(html).toContain('aria-invalid="true"')
  })

  it('associates parts inside a DOM wrapper before hydration', () => {
    const html = renderToString(
      <FormControl id="notifications">
        <Checkbox />
        <div>
          {/* eslint-disable-next-line primer-react/direct-slot-children */}
          <FormControl.Label>Notifications</FormControl.Label>
          {/* eslint-disable-next-line primer-react/direct-slot-children */}
          <FormControl.Caption>Choose a preference.</FormControl.Caption>
          <FormControl.Validation variant="error">A preference is required.</FormControl.Validation>
        </div>
      </FormControl>,
    )

    expect(html).toMatch(/role="checkbox"[^>]*aria-labelledby="notifications-label"/)
    expect(html).toContain('aria-describedby="notifications-validation notifications-caption"')
    expect(html).toContain('aria-invalid="true"')
  })

  it('associates labels with radio and switch inputs before hydration', () => {
    const fields = [
      <RadioGroup name="options" key="radio">
        <RadioGroup.Label>Options</RadioGroup.Label>
        <FormControl id="radio-field">
          <FormControl.Label>Option</FormControl.Label>
          <Radio value="one" />
        </FormControl>
      </RadioGroup>,
      <FormControl id="switch-field" key="switch">
        <FormControl.Label>Enabled</FormControl.Label>
        <ToggleSwitch />
      </FormControl>,
      <RadioGroup name="explicit-options" key="explicit-radio">
        <RadioGroup.Label>Options</RadioGroup.Label>
        <FormControl>
          <FormControl.Label htmlFor="explicit-radio-field">Option</FormControl.Label>
          <Radio id="explicit-radio-field" value="one" />
        </FormControl>
      </RadioGroup>,
      <FormControl key="explicit-switch">
        <FormControl.Label htmlFor="explicit-switch-field">Enabled</FormControl.Label>
        <ToggleSwitch id="explicit-switch-field" />
      </FormControl>,
    ]

    for (const field of fields) {
      const html = renderToString(field)
      const labelId = html.match(/<label[^>]*\sfor="([^"]+)"/)?.[1]
      const inputId = html.match(/<input[^>]*\sid="([^"]+)"/)?.[1]
      expect(labelId).toBeDefined()
      expect(inputId).toBe(labelId)
    }
  })

  it('names wrapped package choice controls on the server', () => {
    function WrappedCheckbox(props: React.ComponentProps<typeof Checkbox>) {
      return <Checkbox {...props} />
    }
    function WrappedRadio(props: React.ComponentProps<typeof Radio>) {
      return <Radio {...props} />
    }
    function WrappedSwitch(props: React.ComponentProps<typeof ToggleSwitch>) {
      return <ToggleSwitch {...props} />
    }
    const html = renderToString(
      <>
        <FormControl id="checkbox-field">
          <FormControl.Label>Notifications</FormControl.Label>
          <WrappedCheckbox />
        </FormControl>
        <RadioGroup name="options">
          <RadioGroup.Label>Options</RadioGroup.Label>
          <FormControl id="radio-field">
            <FormControl.Label>Email</FormControl.Label>
            <WrappedRadio value="email" />
          </FormControl>
        </RadioGroup>
        <FormControl id="switch-field">
          <FormControl.Label>Enabled</FormControl.Label>
          <WrappedSwitch aria-label="Enabled for notifications" />
        </FormControl>
      </>,
    )

    expect(html).toMatch(/<label[^>]*\sid="checkbox-field-label"/)
    expect(html).toMatch(/role="checkbox"[^>]*aria-labelledby="checkbox-field-label"/)
    expect(html).toMatch(/<label[^>]*\sid="radio-field-label"/)
    expect(html).toMatch(/role="radio"[^>]*aria-labelledby="radio-field-label"/)
    expect(html).toMatch(/<label[^>]*\sid="switch-field-label"/)
    expect(html).toMatch(/role="switch"[^>]*aria-labelledby="switch-field-label"/)
  })
})
