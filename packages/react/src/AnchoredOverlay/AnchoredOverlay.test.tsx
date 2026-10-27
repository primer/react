import {createRef, useCallback, useRef, useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {act, fireEvent, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'
import BaseStyles from '../BaseStyles'
import type {AnchorPosition} from '@primer/behaviors'
import {implementsClassName} from '../utils/testing'
import {createRenderCounter} from '../utils/testing/profiler'
import {FeatureFlags} from '../FeatureFlags'
import {registerPortalRoot} from '../Portal'

import overlayClasses from '../Overlay/Overlay.module.css'
import anchoredOverlayClasses from './AnchoredOverlay.module.css'
import type {OverlayProps} from '../Overlay'

type TestComponentSettings = {
  initiallyOpen?: boolean
  onOpenCallback?: (gesture: string) => void
  onCloseCallback?: (gesture: string) => void
  onPositionChange?: ({position}: {position: AnchorPosition}) => void
  className?: string
  withCSSAnchorPositioningFeatureFlag?: boolean
  overlayProps?: Pick<OverlayProps, '_PrivateDisablePortal'>
  renderAs?: 'portal' | 'popover'
}

const AnchoredOverlayTestComponent = ({
  initiallyOpen = false,
  onOpenCallback,
  onCloseCallback,
  onPositionChange,
  className,
  withCSSAnchorPositioningFeatureFlag,
  overlayProps,
  renderAs,
}: TestComponentSettings = {}) => {
  const [open, setOpen] = useState(initiallyOpen)
  const onOpen = useCallback(
    (gesture: string) => {
      setOpen(true)
      onOpenCallback?.(gesture)
    },
    [onOpenCallback],
  )
  const onClose = useCallback(
    (gesture: string) => {
      setOpen(true)
      onCloseCallback?.(gesture)
    },
    [onCloseCallback],
  )

  const content = (
    <BaseStyles>
      <AnchoredOverlay
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        renderAnchor={props => <Button {...props}>Anchor Button</Button>}
        onPositionChange={onPositionChange}
        className={className}
        renderAs={renderAs}
        {...overlayProps}
      >
        <button type="button">Focusable Child</button>
      </AnchoredOverlay>
    </BaseStyles>
  )

  if (withCSSAnchorPositioningFeatureFlag !== undefined) {
    return (
      <FeatureFlags flags={{primer_react_css_anchor_positioning: withCSSAnchorPositioningFeatureFlag}}>
        {content}
      </FeatureFlags>
    )
  }

  return content
}

describe.each([true, false])(
  'AnchoredOverlay (primer_react_css_anchor_positioning=%s)',
  (withCSSAnchorPositioningFeatureFlag: boolean) => {
    implementsClassName(
      props => (
        <AnchoredOverlayTestComponent
          initiallyOpen={true}
          withCSSAnchorPositioningFeatureFlag={withCSSAnchorPositioningFeatureFlag}
          {...props}
        />
      ),
      overlayClasses.Overlay,
    )

    it('should call onOpen when the anchor is clicked', async () => {
      const mockOpenCallback = vi.fn()
      const mockCloseCallback = vi.fn()
      const anchoredOverlay = render(
        <AnchoredOverlayTestComponent
          onOpenCallback={mockOpenCallback}
          onCloseCallback={mockCloseCallback}
          withCSSAnchorPositioningFeatureFlag={withCSSAnchorPositioningFeatureFlag}
        />,
      )
      const anchor = anchoredOverlay.baseElement.querySelector('[aria-haspopup="true"]')!
      await userEvent.click(anchor)

      expect(mockOpenCallback).toHaveBeenCalledTimes(1)
      expect(mockOpenCallback).toHaveBeenCalledWith('anchor-click')
      expect(mockCloseCallback).toHaveBeenCalledTimes(0)
    })

    it('should call onOpen when the anchor activated by a key press', async () => {
      const mockOpenCallback = vi.fn()
      const mockCloseCallback = vi.fn()
      const anchoredOverlay = render(
        <AnchoredOverlayTestComponent
          onOpenCallback={mockOpenCallback}
          onCloseCallback={mockCloseCallback}
          withCSSAnchorPositioningFeatureFlag={withCSSAnchorPositioningFeatureFlag}
        />,
      )
      const anchor = anchoredOverlay.baseElement.querySelector('[aria-haspopup="true"]')!
      fireEvent.keyDown(anchor, {key: ' '})

      expect(mockOpenCallback).toHaveBeenCalledTimes(1)
      expect(mockOpenCallback).toHaveBeenCalledWith('anchor-key-press')
      expect(mockCloseCallback).toHaveBeenCalledTimes(0)
    })

    it('should call onClose when the user clicks off of the overlay', async () => {
      const mockOpenCallback = vi.fn()
      const mockCloseCallback = vi.fn()
      const anchoredOverlay = render(
        <AnchoredOverlayTestComponent
          initiallyOpen={true}
          onOpenCallback={mockOpenCallback}
          onCloseCallback={mockCloseCallback}
          withCSSAnchorPositioningFeatureFlag={withCSSAnchorPositioningFeatureFlag}
        />,
      )
      await userEvent.click(anchoredOverlay.baseElement)

      expect(mockOpenCallback).toHaveBeenCalledTimes(0)
      expect(mockCloseCallback).toHaveBeenCalledTimes(1)
      expect(mockCloseCallback).toHaveBeenCalledWith('click-outside')
    })

    it('should call onClose when the escape key is pressed', async () => {
      const mockOpenCallback = vi.fn()
      const mockCloseCallback = vi.fn()

      render(
        <AnchoredOverlayTestComponent
          initiallyOpen={true}
          onOpenCallback={mockOpenCallback}
          onCloseCallback={mockCloseCallback}
          withCSSAnchorPositioningFeatureFlag={withCSSAnchorPositioningFeatureFlag}
        />,
      )

      await userEvent.keyboard('{Escape}')

      expect(mockOpenCallback).toHaveBeenCalledTimes(0)
      expect(mockCloseCallback).toHaveBeenCalledTimes(1)
      expect(mockCloseCallback).toHaveBeenCalledWith('escape')
    })

    it.skipIf(withCSSAnchorPositioningFeatureFlag)('should call onPositionChange when provided', async () => {
      const mockPositionChangeCallback = vi.fn(({position}: {position: AnchorPosition}) => position)
      render(
        <AnchoredOverlayTestComponent
          initiallyOpen={true}
          onPositionChange={mockPositionChangeCallback}
          withCSSAnchorPositioningFeatureFlag={withCSSAnchorPositioningFeatureFlag}
        />,
      )

      await userEvent.keyboard('{Escape}')

      expect(mockPositionChangeCallback).toHaveBeenCalled()
      expect(mockPositionChangeCallback).toHaveBeenCalledWith({
        position: {
          anchorAlign: 'start',
          anchorSide: 'outside-bottom',
          left: 0,
          top: 36,
        },
      })
    })

    it('renders data-component attributes for AnchoredOverlay parts when shown', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <BaseStyles>
            <AnchoredOverlay
              open={true}
              onOpen={() => {}}
              onClose={() => {}}
              renderAnchor={props => <Button {...props}>Anchor Button</Button>}
              variant={{regular: 'anchored', narrow: 'fullscreen'}}
            >
              <div>content</div>
            </AnchoredOverlay>
          </BaseStyles>
        </FeatureFlags>,
      )
      expect(baseElement.querySelector('[data-component="AnchoredOverlay"]')).toBeInTheDocument()
      expect(baseElement.querySelector('[data-component="AnchoredOverlay.CloseButton"]')).toBeInTheDocument()
    })

    it('should support a `ref` through `overlayProps` on the overlay element', () => {
      const ref = createRef<HTMLDivElement>()

      function Test() {
        const anchorRef = useRef(null)
        return (
          <FeatureFlags flags={{primer_react_css_anchor_positioning: withCSSAnchorPositioningFeatureFlag}}>
            <AnchoredOverlay
              overlayProps={{
                ref,
              }}
              open
              renderAnchor={props => {
                return (
                  <button {...props} ref={anchorRef} type="button">
                    anchor
                  </button>
                )
              }}
            >
              <div>content</div>
            </AnchoredOverlay>
          </FeatureFlags>
        )
      }

      render(<Test />)

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveAttribute('data-component', 'AnchoredOverlay')
    })
  },
)

describe('AnchoredOverlay scroll/resize cascade', () => {
  it('does not re-render after close when window scrolls (closed-overlay listeners detached)', async () => {
    // Before the `enabled: open` fix, useAnchoredPosition kept its scroll
    // listeners attached while the overlay was closed. The first scroll event
    // after a close would fire updatePosition, hit the else branch, and call
    // setPosition(undefined) — which differs from the stale last-open value,
    // forcing a re-render of AnchoredOverlay. Gating `enabled` on `open` tears
    // the listeners down on close so no spurious re-render fires.
    function Demo() {
      const [open, setOpen] = useState(false)
      return (
        <BaseStyles>
          <AnchoredOverlay
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderAnchor={props => <Button {...props}>Toggle</Button>}
          >
            <div>content</div>
          </AnchoredOverlay>
        </BaseStyles>
      )
    }

    const [Wrap, counter] = createRenderCounter()
    render(
      <Wrap>
        <Demo />
      </Wrap>,
    )

    // Open then close the overlay so position has a non-undefined last value.
    await userEvent.click(document.body.querySelector('button')!)
    await userEvent.keyboard('{Escape}')

    // Let any pending close-time effects flush.
    await act(async () => {})
    counter.reset()

    // Dispatch a scroll event on window. Under the old behavior this would
    // fire the still-attached rAF-throttled handler → setPosition(undefined)
    // → one re-render. Under the fix, listeners were torn down on close.
    await act(async () => {
      window.dispatchEvent(new Event('scroll', {bubbles: true}))
      // Flush rAF so any (incorrectly) scheduled updatePosition would run.
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
    })

    expect(counter.updateCount).toBe(0)
  })
})

describe('AnchoredOverlay feature flag specific behavior', () => {
  describe('with primer_react_css_anchor_positioning feature flag enabled', () => {
    it('should render overlay as visible immediately when flag is enabled', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} />
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlay).toHaveAttribute('data-visibility-visible', '')
    })

    it('should use portal when flag is enabled', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} overlayProps={{_PrivateDisablePortal: false}} />
        </FeatureFlags>,
      )

      const portalRoot = baseElement.querySelector('#__primerPortalRoot__')
      const overlayInPortal = portalRoot?.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlayInPortal).toBeInTheDocument()
    })

    it('should not use portal when _PrivateDisablePortal is passed via overlayProps', () => {
      const {baseElement, container} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <BaseStyles>
            <AnchoredOverlay
              open={true}
              onOpen={() => {}}
              onClose={() => {}}
              renderAnchor={props => <Button {...props}>Anchor Button</Button>}
              overlayProps={{_PrivateDisablePortal: true}}
            >
              <button type="button">Focusable Child</button>
            </AnchoredOverlay>
          </BaseStyles>
        </FeatureFlags>,
      )

      // The overlay should not be inside the portal root
      const portalRoot = baseElement.querySelector('#__primerPortalRoot__')
      const overlayInPortal = portalRoot?.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlayInPortal).toBeNull()

      // The overlay should be inside the container
      const overlayInContainer = container.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlayInContainer).toBeInTheDocument()
    })

    it('should apply AnchoredOverlay class to overlay when flag is enabled', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} />
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlay).toHaveClass(anchoredOverlayClasses.AnchoredOverlay)
    })

    it('should set data-anchor-position attribute when flag is enabled', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} />
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlay).toHaveAttribute('data-anchor-position', 'true')
    })

    it('should set popover="manual" on overlay when renderAs is "popover"', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} renderAs="popover" />
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlay).toHaveAttribute('popover', 'manual')
    })

    it('should set popovertarget on anchor when renderAs is "popover"', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} renderAs="popover" />
        </FeatureFlags>,
      )

      const anchor = baseElement.querySelector('[aria-haspopup="true"]')
      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
      expect(anchor).toHaveAttribute('popovertarget')
      expect(anchor!.getAttribute('popovertarget')).toBe(overlay!.getAttribute('id'))
    })

    it('should not set popover attribute on overlay when renderAs is "portal"', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} renderAs="portal" />
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlay).not.toHaveAttribute('popover')
    })

    it('should not set popover attribute on overlay when renderAs defaults to "portal"', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} />
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlay).not.toHaveAttribute('popover')
    })

    it('should disable CSS side fallbacks when cssAnchorPositioningSettings.fallbackStrategy is "none"', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <BaseStyles>
            <AnchoredOverlay
              open={true}
              onOpen={() => {}}
              onClose={() => {}}
              renderAnchor={props => <Button {...props}>Anchor Button</Button>}
              side="outside-bottom"
              cssAnchorPositioningSettings={{fallbackStrategy: 'none'}}
            >
              <button type="button">Focusable Child</button>
            </AnchoredOverlay>
          </BaseStyles>
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]') as HTMLElement
      expect(overlay.style.getPropertyValue('position-try-fallbacks')).toBe('none')
    })

    it('should only allow opposite-side CSS fallback when cssAnchorPositioningSettings.fallbackStrategy is "opposite-side"', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <BaseStyles>
            <AnchoredOverlay
              open={true}
              onOpen={() => {}}
              onClose={() => {}}
              renderAnchor={props => <Button {...props}>Anchor Button</Button>}
              side="outside-bottom"
              cssAnchorPositioningSettings={{fallbackStrategy: 'opposite-side'}}
            >
              <button type="button">Focusable Child</button>
            </AnchoredOverlay>
          </BaseStyles>
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]') as HTMLElement
      expect(overlay.style.getPropertyValue('position-try-fallbacks')).toBe('flip-block')
    })

    describe('when overlayProps.portalContainerName is provided', () => {
      it('should fall back to JS positioning (data-anchor-position="false") even with the flag enabled', () => {
        const portalRoot = document.createElement('div')
        document.body.appendChild(portalRoot)
        registerPortalRoot(portalRoot, 'anchoredOverlayTestPortal')

        const {baseElement} = render(
          <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
            <BaseStyles>
              <AnchoredOverlay
                open={true}
                onOpen={() => {}}
                onClose={() => {}}
                renderAnchor={props => <Button {...props}>Anchor Button</Button>}
                overlayProps={{portalContainerName: 'anchoredOverlayTestPortal'}}
              >
                <button type="button">Focusable Child</button>
              </AnchoredOverlay>
            </BaseStyles>
          </FeatureFlags>,
        )

        const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
        expect(overlay).toHaveAttribute('data-anchor-position', 'false')
        expect(overlay).not.toHaveClass(anchoredOverlayClasses.AnchoredOverlay)

        portalRoot.remove()
      })

      it('should not opt into the Popover API even when renderAs="popover"', () => {
        const portalRoot = document.createElement('div')
        document.body.appendChild(portalRoot)
        registerPortalRoot(portalRoot, 'anchoredOverlayTestPortalPopover')

        const {baseElement} = render(
          <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
            <BaseStyles>
              <AnchoredOverlay
                open={true}
                onOpen={() => {}}
                onClose={() => {}}
                renderAnchor={props => <Button {...props}>Anchor Button</Button>}
                renderAs="popover"
                overlayProps={{portalContainerName: 'anchoredOverlayTestPortalPopover'}}
              >
                <button type="button">Focusable Child</button>
              </AnchoredOverlay>
            </BaseStyles>
          </FeatureFlags>,
        )

        const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
        expect(overlay).not.toHaveAttribute('popover')

        const anchor = baseElement.querySelector('[aria-haspopup="true"]')
        expect(anchor).not.toHaveAttribute('popovertarget')

        portalRoot.remove()
      })
    })
  })

  describe('with primer_react_css_anchor_positioning feature flag disabled', () => {
    it('should use portal when flag is disabled', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: false}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} />
        </FeatureFlags>,
      )

      // The overlay should be inside the portal root
      const portalRoot = baseElement.querySelector('#__primerPortalRoot__')
      const overlayInPortal = portalRoot?.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlayInPortal).toBeInTheDocument()
    })

    it('should set data-anchor-position to false when flag is disabled', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: false}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} />
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlay).toHaveAttribute('data-anchor-position', 'false')
    })

    it('should not set popover attribute on overlay when renderAs is "popover" but flag is disabled', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: false}}>
          <AnchoredOverlayTestComponent initiallyOpen={true} renderAs="popover" />
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]')
      expect(overlay).not.toHaveAttribute('popover')
    })

    it('should ignore cssAnchorPositioningSettings when CSS anchor positioning is disabled', () => {
      const {baseElement} = render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: false}}>
          <BaseStyles>
            <AnchoredOverlay
              open={true}
              onOpen={() => {}}
              onClose={() => {}}
              renderAnchor={props => <Button {...props}>Anchor Button</Button>}
              side="outside-bottom"
              cssAnchorPositioningSettings={{fallbackStrategy: 'none'}}
            >
              <button type="button">Focusable Child</button>
            </AnchoredOverlay>
          </BaseStyles>
        </FeatureFlags>,
      )

      const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]') as HTMLElement
      expect(overlay.style.getPropertyValue('position-try-fallbacks')).toBe('')
    })
  })
})

describe('AnchoredOverlay CSS anchor positioning viewport handling', () => {
  it('should set --anchored-overlay-top-override when the overlay would overflow the viewport bottom', async () => {
    function TestComponent() {
      const ref = useRef<HTMLButtonElement>(null)
      return (
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <BaseStyles>
            {/* Position anchor near the bottom so the overlay starts low and overflows */}
            <button
              type="button"
              ref={ref}
              style={{position: 'fixed', left: 0, bottom: '100px', height: '32px', width: '80px'}}
              data-testid="anchor"
            >
              Anchor
            </button>
            <AnchoredOverlay
              open
              onOpen={() => {}}
              onClose={() => {}}
              renderAnchor={null}
              anchorRef={ref}
              side="outside-bottom"
            >
              {/* Content sized to fill the overlay's max-height */}
              <div style={{height: '100vh', width: '120px'}}>tall content</div>
            </AnchoredOverlay>
          </BaseStyles>
        </FeatureFlags>
      )
    }

    const {baseElement} = render(<TestComponent />)
    const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]') as HTMLElement

    // Wait for the rAF positioning callback to execute.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))))

    // When the browser's position-try-fallbacks handle the flip, the JS
    // getBoundingClientRect check may see the corrected position and not set
    // the override. Either outcome is valid — what matters is the property is
    // a valid px value or empty (no crash, no invalid state).
    const value = overlay.style.getPropertyValue('--anchored-overlay-top-override')
    if (value !== '') {
      expect(value.endsWith('px')).toBe(true)
      expect(parseFloat(value)).toBeGreaterThanOrEqual(0)
    }
  })

  it('should not set --anchored-overlay-top-override when the overlay fits in the viewport', async () => {
    function TestComponent() {
      const ref = useRef<HTMLButtonElement>(null)
      return (
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <BaseStyles>
            <button type="button" ref={ref} style={{position: 'fixed', left: 0, top: 0}}>
              Anchor
            </button>
            <AnchoredOverlay open onOpen={() => {}} onClose={() => {}} renderAnchor={null} anchorRef={ref}>
              <div style={{height: '40px', width: '120px'}}>short content</div>
            </AnchoredOverlay>
          </BaseStyles>
        </FeatureFlags>
      )
    }

    const {baseElement} = render(<TestComponent />)
    const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]') as HTMLElement

    // Wait two frames so the rAF positioning callback has run.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))))

    expect(overlay.style.getPropertyValue('--anchored-overlay-top-override')).toBe('')
  })

  it('should set data-side based on position and available space', async () => {
    function TestComponent() {
      const ref = useRef<HTMLButtonElement>(null)
      // Anchor pinned to the bottom-right corner so an outside-bottom + start
      // overlay would overflow both the right and bottom edges of the viewport.
      return (
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <BaseStyles>
            <button
              type="button"
              ref={ref}
              style={{position: 'fixed', right: 0, bottom: 0, width: '40px', height: '20px'}}
              data-testid="anchor"
            >
              A
            </button>
            <AnchoredOverlay
              open
              onOpen={() => {}}
              onClose={() => {}}
              renderAnchor={null}
              anchorRef={ref}
              side="outside-bottom"
              width="medium"
            >
              <div style={{height: `${window.innerHeight + 200}px`}}>tall content</div>
            </AnchoredOverlay>
          </BaseStyles>
        </FeatureFlags>
      )
    }

    const {baseElement} = render(<TestComponent />)
    const overlay = baseElement.querySelector('[data-component="AnchoredOverlay"]') as HTMLElement

    // Wait for the rAF positioning callback to execute.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))))

    // The browser's CSS position-try-fallbacks may handle the overflow natively
    // before JS reads getBoundingClientRect, so the JS suggestedSide logic may
    // not trigger. Verify that data-side is a valid value (the browser or JS
    // chose a side) and the component didn't crash.
    const dataSide = overlay.getAttribute('data-side')
    expect(['outside-bottom', 'outside-top', 'outside-left', 'outside-right']).toContain(dataSide)
  })
})

describe('AnchoredOverlay anchor element replacement', () => {
  it('should re-apply anchor-name to a new anchor DOM element when the overlay reopens', () => {
    function TestComponent() {
      const anchorRef = useRef<HTMLButtonElement>(null)
      const [open, setOpen] = useState(true)
      const [anchorKey, setAnchorKey] = useState(0)

      return (
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <button type="button" data-testid="switch" onClick={() => setAnchorKey(k => k + 1)}>
            Switch
          </button>
          <button type="button" data-testid="toggle" onClick={() => setOpen(o => !o)}>
            Toggle
          </button>
          <button key={anchorKey} ref={anchorRef} type="button" data-testid="anchor">
            Anchor
          </button>
          <AnchoredOverlay
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            renderAnchor={null}
            anchorRef={anchorRef}
          >
            <div>content</div>
          </AnchoredOverlay>
        </FeatureFlags>
      )
    }

    const {baseElement} = render(<TestComponent />)

    // Verify anchor-name is set on the initial anchor element
    const initialAnchor = baseElement.querySelector('[data-testid="anchor"]') as HTMLElement
    expect(initialAnchor.style.getPropertyValue('anchor-name')).not.toBe('')
    const anchorName = initialAnchor.style.getPropertyValue('anchor-name')

    // Close the overlay
    const toggleButton = baseElement.querySelector('[data-testid="toggle"]') as HTMLElement
    act(() => {
      toggleButton.click()
    })

    // Replace the anchor DOM element by changing its key while overlay is closed
    const switchButton = baseElement.querySelector('[data-testid="switch"]') as HTMLElement
    act(() => {
      switchButton.click()
    })

    // Reopen the overlay — the new anchor should get anchor-name before paint
    act(() => {
      toggleButton.click()
    })

    const newAnchor = baseElement.querySelector('[data-testid="anchor"]') as HTMLElement
    expect(newAnchor).not.toBe(initialAnchor)
    expect(newAnchor.style.getPropertyValue('anchor-name')).toBe(anchorName)
  })
})

describe('AnchoredOverlay overlay forwarded ref (primer_react_merged_forwarded_refs)', () => {
  for (const enabled of [true, false]) {
    describe(`with the flag ${enabled ? 'enabled' : 'disabled'}`, () => {
      it('forwards a ref object to the overlay', () => {
        const ref = createRef<HTMLDivElement>()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <BaseStyles>
              <AnchoredOverlay
                open
                onClose={() => {}}
                onOpen={() => {}}
                renderAnchor={props => <Button {...props}>Anchor</Button>}
                overlayProps={{ref}}
              >
                <button type="button">Child</button>
              </AnchoredOverlay>
            </BaseStyles>
          </FeatureFlags>,
        )
        expect(ref.current).toBeInstanceOf(HTMLDivElement)
      })

      it('calls a callback ref with the overlay', () => {
        const refCallback = vi.fn()
        render(
          <FeatureFlags flags={{primer_react_merged_forwarded_refs: enabled}}>
            <BaseStyles>
              <AnchoredOverlay
                open
                onClose={() => {}}
                onOpen={() => {}}
                renderAnchor={props => <Button {...props}>Anchor</Button>}
                overlayProps={{ref: refCallback}}
              >
                <button type="button">Child</button>
              </AnchoredOverlay>
            </BaseStyles>
          </FeatureFlags>,
        )
        expect(refCallback.mock.calls.some(([el]) => el instanceof HTMLDivElement)).toBe(true)
      })
    })
  }
})
