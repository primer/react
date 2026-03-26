import {act, createRef, useCallback, useRef, useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {userEvent} from 'vitest/browser'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {Button} from '../Button'
import BaseStyles from '../BaseStyles'
import type {AnchorPosition} from '@primer/behaviors'
import {implementsClassName} from '../utils/testing'
import {FeatureFlags} from '../FeatureFlags'

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
}

const AnchoredOverlayTestComponent = ({
  initiallyOpen = false,
  onOpenCallback,
  onCloseCallback,
  onPositionChange,
  className,
  withCSSAnchorPositioningFeatureFlag,
  overlayProps,
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
      await act(async () => {
        await userEvent.click(anchor)
      })

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
      await act(async () => {
        await userEvent.type(anchor, '{Space}')
      })

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
      await act(async () => {
        await userEvent.click(anchoredOverlay.baseElement)
      })

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

      await act(async () => {
        await userEvent.keyboard('{Escape}')
      })

      expect(mockOpenCallback).toHaveBeenCalledTimes(0)
      expect(mockCloseCallback).toHaveBeenCalledTimes(1)
      expect(mockCloseCallback).toHaveBeenCalledWith('escape')
    })

    it('should call onPositionChange when provided', async () => {
      const mockPositionChangeCallback = vi.fn(({position}: {position: AnchorPosition}) => position)
      render(
        <AnchoredOverlayTestComponent
          initiallyOpen={true}
          onPositionChange={mockPositionChangeCallback}
          withCSSAnchorPositioningFeatureFlag={withCSSAnchorPositioningFeatureFlag}
        />,
      )

      await act(async () => {
        await userEvent.keyboard('{Escape}')
      })

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
  })
})
