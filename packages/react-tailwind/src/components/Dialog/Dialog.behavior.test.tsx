import React, {useState} from 'react'
import {cleanup, render} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {GearIcon} from '@primer/octicons-react'
import {BaseStyles} from '../../BaseStyles'
import {ThemeProvider} from '../../ThemeProvider'
import {resetDevWarningsForTest} from '../../internal/devWarning'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
import {Dialog} from './Dialog'
import docs from './Dialog.docs.json'

const settle = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms))

const Shell: React.FC<{readonly children: React.ReactNode}> = ({children}) => {
  return (
    <ThemeProvider>
      <BaseStyles>{children}</BaseStyles>
    </ThemeProvider>
  )
}

describe('Dialog behavior guardrails parity', () => {
  beforeEach(() => {
    resetDevWarningsForTest()
  })

  afterEach(() => {
    cleanup()
  })

  const behaviorTests: Record<string, unknown> = {
    'modal-focus-containment': it('behavior [modal-focus-containment]', async () => {
      function Example() {
        return (
          <Shell>
            <button type="button" data-testid="outside">
              Outside
            </button>
            <Dialog>
              <Dialog.Trigger render={<Button data-testid="trigger">Open dialog</Button>} />
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Confirm</Dialog.Title>
                  <Dialog.CloseButton />
                </Dialog.Header>
                <Dialog.Body>Are you sure?</Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close render={<Button>Cancel</Button>} />
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          </Shell>
        )
      }

      render(<Example />)
      const trigger = document.querySelector<HTMLButtonElement>('[data-testid="trigger"]')!
      await userEvent.click(trigger)
      await settle(120)

      const popup = document.querySelector<HTMLElement>('[role="dialog"]')!
      expect(popup).toBeTruthy()
      expect(popup.contains(document.activeElement)).toBe(true)

      await userEvent.keyboard('{Tab}')
      await settle(40)
      expect(popup.contains(document.activeElement)).toBe(true)

      await userEvent.keyboard('{Escape}')
      await settle(120)
      expect(document.querySelector('[role="dialog"]')).toBeNull()
      expect(document.activeElement).toBe(trigger)
    }),

    'title-wires-accessible-name': it('behavior [title-wires-accessible-name]', async () => {
      render(
        <Shell>
          <Dialog open>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete repository</Dialog.Title>
                <Dialog.Subtitle>This cannot be undone.</Dialog.Subtitle>
              </Dialog.Header>
              <Dialog.Body>Confirm deletion.</Dialog.Body>
            </Dialog.Content>
          </Dialog>
        </Shell>,
      )
      await settle(80)
      const dialog = page.getByRole('dialog')
      await expect.element(dialog).toHaveAccessibleName('Delete repository')
      await expect.element(dialog).toHaveAccessibleDescription('This cannot be undone.')
    }),

    'escape-respects-inner-overlays': it('behavior [escape-respects-inner-overlays]', async () => {
      render(
        <Shell>
          <Dialog open>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Settings</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <IconButton icon={GearIcon} aria-label="Advanced details" />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button>Cancel</Button>} />
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </Shell>,
      )
      await settle(100)
      const infoBtn = document.querySelector<HTMLButtonElement>('button[aria-label="Advanced details"]')!
      await userEvent.hover(infoBtn)
      await settle(120)

      await userEvent.keyboard('{Escape}')
      await settle(100)
      expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    }),

    'return-focus-target': it('behavior [return-focus-target]', async () => {
      function Example() {
        const [open, setOpen] = useState(false)
        const overrideRef = React.useRef<HTMLButtonElement>(null)
        return (
          <Shell>
            <Button onClick={() => setOpen(true)} data-testid="opener">
              Open
            </Button>
            <Button ref={overrideRef} data-testid="override">
              Fallback target
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <Dialog.Content finalFocus={overrideRef}>
                <Dialog.Title>Custom return</Dialog.Title>
                <Dialog.Footer>
                  <Dialog.Close render={<Button>Close</Button>} />
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          </Shell>
        )
      }

      render(<Example />)
      await userEvent.click(document.querySelector<HTMLButtonElement>('[data-testid="opener"]')!)
      await settle(100)
      await userEvent.keyboard('{Escape}')
      await settle(120)
      expect(document.activeElement).toBe(document.querySelector('[data-testid="override"]'))
    }),
  }

  const devWarningTests: Record<string, unknown> = {
    'missing-accessible-name': it('runtime usageGuideline [missing-accessible-name]', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        render(
          <Shell>
            <Dialog open>
              <Dialog.Content>
                <Dialog.Header>Plain text without Dialog.Title</Dialog.Header>
                <Dialog.Body>Body</Dialog.Body>
              </Dialog.Content>
            </Dialog>
          </Shell>,
        )
        await settle(80)
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[Dialog/missing-accessible-name]'))

        cleanup()
        warnSpy.mockClear()
        resetDevWarningsForTest()

        render(
          <Shell>
            <Dialog open>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Proper title</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>Body</Dialog.Body>
              </Dialog.Content>
            </Dialog>
          </Shell>,
        )
        await settle(80)
        expect(warnSpy).not.toHaveBeenCalled()
      } finally {
        warnSpy.mockRestore()
      }
    }),
  }

  it('maintains 1:1 parity with Dialog.docs.json behaviors and runtime usageGuidelines', () => {
    const allBehaviors = [...docs.builtInBehaviors, ...docs.defaultBehaviors]
    expect(Object.keys(behaviorTests).sort()).toEqual(allBehaviors.map(b => b.id).sort())
    const expectedRuntime = docs.usageGuidelines.filter(g => g.check === 'runtime').map(g => g.id)
    expect(Object.keys(devWarningTests).sort()).toEqual(expectedRuntime.sort())
  })
})
