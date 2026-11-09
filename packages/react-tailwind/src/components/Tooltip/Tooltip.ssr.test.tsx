// @vitest-environment node
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {Tooltip} from './Tooltip'

describe('Tooltip server markup', () => {
  it('retains an explicit label on an icon-only trigger', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip" type="label" keybindingHint="Control+K">
        <Tooltip.Trigger aria-label="Save changes">
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content>Save changes</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toContain('aria-label="Save changes"')
    expect(html).toContain('id="server-tooltip"')
    expect(html).toContain('Save changes')
    expect(html).not.toContain('aria-labelledby=')
  })

  it('renders a description target in server markup and preserves a separate description reference', () => {
    const html = renderToString(
      <>
        <span id="server-description" hidden>
          Save changes
        </span>
        <Tooltip id="server-tooltip">
          <Tooltip.Trigger aria-describedby="server-description">Save</Tooltip.Trigger>
          <Tooltip.Content>Save changes</Tooltip.Content>
        </Tooltip>
      </>,
    )
    expect(html).toContain('id="server-description"')
    expect(html).toContain('id="server-tooltip"')
    expect(html).toContain('aria-describedby="server-description server-tooltip"')
  })

  it('preserves a trigger reference to the tooltip id in server markup', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip" type="label">
        <Tooltip.Trigger aria-labelledby="server-tooltip">
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content aria-label="Close feedback form and return to the list">Close feedback form</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toContain('aria-labelledby="server-tooltip"')
    expect(html).toContain('id="server-tooltip"')
    expect(html).toContain('aria-label="Close feedback form and return to the list"')
    expect(html).toContain('Close feedback form')
  })

  it('renders a target when a description tooltip is explicitly used as the name', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip">
        <Tooltip.Trigger aria-label="Fallback name" aria-labelledby="server-tooltip">
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content>Help</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toContain('aria-label="Fallback name"')
    expect(html).toContain('aria-labelledby="server-tooltip"')
    expect(html).toContain('aria-describedby="server-tooltip"')
    expect(html).toContain('id="server-tooltip"')
    expect(html).toContain('Help')
  })

  it('preserves mixed external and tooltip name references in server markup', () => {
    const html = renderToString(
      <>
        <span id="independent-name">Independent name</span>
        <Tooltip id="server-tooltip">
          <Tooltip.Trigger aria-label="Fallback name" aria-labelledby="independent-name server-tooltip">
            <svg aria-hidden="true" />
          </Tooltip.Trigger>
          <Tooltip.Content>Help</Tooltip.Content>
        </Tooltip>
      </>,
    )
    expect(html).toContain('id="independent-name"')
    expect(html).toContain('aria-label="Fallback name"')
    expect(html).toContain('aria-labelledby="independent-name server-tooltip"')
    expect(html).toContain('id="server-tooltip"')
  })

  it('preserves independent aria-label and aria-labelledby names in server markup', () => {
    const html = renderToString(
      <>
        <span id="independent-name">Close feedback form</span>
        <Tooltip id="server-tooltip" type="label">
          <Tooltip.Trigger aria-label="Fallback name" aria-labelledby="independent-name">
            <svg aria-hidden="true" />
          </Tooltip.Trigger>
          <Tooltip.Content aria-label="Close feedback form and return to the list">Close feedback form</Tooltip.Content>
        </Tooltip>
      </>,
    )
    expect(html).toContain('id="independent-name"')
    expect(html).toContain('aria-label="Fallback name"')
    expect(html).toContain('aria-labelledby="independent-name"')
    expect(html).not.toContain('aria-labelledby="server-tooltip"')
  })

  it('keeps a render callback label without referencing tooltip content', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip" type="label">
        <Tooltip.Trigger render={props => <button {...props} aria-label="Caller-owned name" type="button" />}>
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content>Visual label</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toContain('aria-label="Caller-owned name"')
    expect(html).toContain('id="server-tooltip"')
    expect(html).not.toContain('aria-labelledby=')
  })

  it.each([
    ['empty aria-label', {'aria-label': ''}],
    ['whitespace aria-label', {'aria-label': '   '}],
    ['empty aria-labelledby', {'aria-labelledby': ''}],
    ['whitespace aria-labelledby', {'aria-labelledby': '   '}],
  ])('wires a tooltip fallback and renders its target for %s', (_, triggerProps) => {
    const html = renderToString(
      <Tooltip id="server-tooltip" type="label">
        <Tooltip.Trigger {...triggerProps}>
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content aria-label="   ">Meaningful tooltip</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toContain('aria-labelledby="server-tooltip"')
    expect(html).toContain('id="server-tooltip"')
    expect(html).toContain('Meaningful tooltip')
  })

  it('renders a label tooltip and its keyboard hint as reference targets before hydration', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip" type="label" keybindingHint="Control+K">
        <Tooltip.Trigger>
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content>Save changes</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toContain('aria-labelledby="server-tooltip"')
    expect(html).toContain('aria-describedby="server-tooltip-keybinding-hint"')
    expect(html).toContain('id="server-tooltip"')
    expect(html).toContain('id="server-tooltip-keybinding-hint"')
    expect(html).toContain('Save changes')
  })

  it('renders a description tooltip and its keyboard hint in the server reference target', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip" keybindingHint="Control+K">
        <Tooltip.Trigger>Search</Tooltip.Trigger>
        <Tooltip.Content>Search repositories</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toContain('aria-describedby="server-tooltip"')
    expect(html).toContain('id="server-tooltip"')
    expect(html).toContain('Search repositories')
    expect(html).toContain('(control k)')
  })

  it('keeps a contextual description and keyboard hint together in the server reference target', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip" keybindingHint="Control+K">
        <Tooltip.Trigger>Search</Tooltip.Trigger>
        <Tooltip.Content aria-label="Search all repositories">Search</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toMatch(/<span id="server-tooltip" aria-label="Search all repositories \(control k\)" role="group">/)
    expect(html).toContain('(control k)')
  })

  it('keeps content context in the server-rendered target', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip">
        <Tooltip.Trigger>Close</Tooltip.Trigger>
        <Tooltip.Content aria-label="Close feedback form and return to the list">Close feedback form</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toContain('id="server-tooltip"')
    expect(html).toContain('aria-label="Close feedback form and return to the list"')
    expect(html).toContain('Close feedback form')
  })

  it('uses tooltip text when the content aria-label is whitespace-only', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip" type="label">
        <Tooltip.Trigger>
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content aria-label="   ">Meaningful tooltip</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toMatch(/<span id="server-tooltip">Meaningful tooltip<\/span>/)
  })

  it('renders the server reference target when the popup does not use a portal', () => {
    const html = renderToString(
      <Tooltip id="server-tooltip" type="label">
        <Tooltip.Trigger>
          <svg aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Content portal={false}>Save changes</Tooltip.Content>
      </Tooltip>,
    )
    expect(html).toContain('aria-labelledby="server-tooltip"')
    expect(html).toContain('id="server-tooltip"')
    expect(html).toContain('Save changes')
  })
})
