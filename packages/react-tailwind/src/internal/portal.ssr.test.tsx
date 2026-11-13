// @vitest-environment node
import type React from 'react'
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {ActionMenu} from '../components/ActionMenu'
import {AnchoredOverlay} from '../components/AnchoredOverlay'
import {Autocomplete} from '../components/Autocomplete'
import {Button} from '../components/Button'
import {ConfirmationDialog} from '../components/ConfirmationDialog'
import {Dialog} from '../components/Dialog'
import {Popover} from '../components/Popover'
import {Portal} from '../components/Portal'
import {Tooltip} from '../components/Tooltip'

const fixtures: Array<[string, (open: boolean) => React.ReactElement]> = [
  ['Portal', () => <Portal>Portaled</Portal>],
  [
    'Dialog',
    open => (
      <Dialog defaultOpen={open}>
        <Dialog.Trigger render={<Button>Open</Button>} />
        <Dialog.Content>Dialog body</Dialog.Content>
      </Dialog>
    ),
  ],
  [
    'ConfirmationDialog',
    () => (
      <ConfirmationDialog title="Delete?" trigger={<Button>Open</Button>}>
        Are you sure?
      </ConfirmationDialog>
    ),
  ],
  [
    'Tooltip',
    open => (
      <Tooltip defaultOpen={open}>
        <Tooltip.Trigger render={<Button>Save</Button>} />
        <Tooltip.Content>Save this file</Tooltip.Content>
      </Tooltip>
    ),
  ],
  [
    'Popover',
    open => (
      <Popover defaultOpen={open}>
        <Popover.Button>More</Popover.Button>
        <Popover.Content>Popover body</Popover.Content>
      </Popover>
    ),
  ],
  [
    'AnchoredOverlay',
    open => (
      <AnchoredOverlay defaultOpen={open}>
        <AnchoredOverlay.Trigger render={<Button>Open</Button>} />
        <AnchoredOverlay.Content aria-label="Overlay">Overlay body</AnchoredOverlay.Content>
      </AnchoredOverlay>
    ),
  ],
  [
    'ActionMenu',
    open => (
      <ActionMenu defaultOpen={open}>
        <ActionMenu.Button>Menu</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionMenu.Item>Copy</ActionMenu.Item>
        </ActionMenu.Overlay>
      </ActionMenu>
    ),
  ],
  [
    'Autocomplete',
    () => (
      <Autocomplete items={['Apple']}>
        <Autocomplete.Input aria-label="Fruit" />
        <Autocomplete.Content>
          <Autocomplete.List>
            {(fruit: string) => (
              <Autocomplete.Item key={fruit} value={fruit}>
                {fruit}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete>
    ),
  ],
]

describe('portal-backed components on the server', () => {
  it('runs without a DOM', () => {
    expect(typeof document).toBe('undefined')
  })

  it.each(fixtures)('%s renders closed and open without touching the DOM', (_name, fixture) => {
    expect(() => renderToString(fixture(false))).not.toThrow()
    expect(() => renderToString(fixture(true))).not.toThrow()
  })

  it('does not render portal content into the server markup', () => {
    expect(renderToString(<Portal>Portaled</Portal>)).toBe('')
  })

  it('renders nested floating layers without accessing a portal container', () => {
    expect(() =>
      renderToString(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Settings</Dialog.Title>
            <ActionMenu defaultOpen>
              <ActionMenu.Button>Actions</ActionMenu.Button>
              <ActionMenu.Content>
                <ActionMenu.Item>Rename</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu>
          </Dialog.Content>
        </Dialog>,
      ),
    ).not.toThrow()
  })
})
