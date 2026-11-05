'use client'

import React from 'react'

export type Politeness = 'assertive' | 'polite'

export interface AnnounceProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'aria-atomic' | 'aria-live' | 'hidden' | 'role'> {
  /** Announces the content when the region first becomes visible, rather than only on later changes. */
  announceOnShow?: boolean
  /** Element to render. */
  as?: React.ElementType
  /** Overrides the marker used to identify this element in tests and styling. */
  'data-component'?: string
  /** Delay before announcing, which lets rapidly changing content settle first. */
  delayMs?: number
  /** Hides the region visually while it keeps announcing to assistive technology. */
  hidden?: boolean
  /** Whether the announcement waits for a pause or interrupts immediately. */
  politeness?: Politeness
}

export const Announce = React.forwardRef<HTMLElement, AnnounceProps>(function Announce(
  {
    announceOnShow = true,
    as: Component = 'div',
    'data-component': dataComponent = 'Announce',
    delayMs,
    hidden = false,
    politeness = 'polite',
    ...rest
  },
  ref,
) {
  const [isLive, setIsLive] = React.useState(() => announceOnShow && !hidden && delayMs === undefined)
  const isInitialEffect = React.useRef(true)

  React.useEffect(() => {
    if (isInitialEffect.current && announceOnShow && !hidden && delayMs === undefined) {
      isInitialEffect.current = false
      return
    }

    isInitialEffect.current = false
    setIsLive(false)

    if (hidden) {
      return
    }

    const timeout = window.setTimeout(() => {
      setIsLive(true)
    }, delayMs ?? 0)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [announceOnShow, delayMs, hidden])

  const role = politeness === 'assertive' ? 'alert' : 'status'

  return (
    <Component
      {...rest}
      ref={ref}
      aria-atomic="true"
      aria-live={isLive ? politeness : 'off'}
      data-component={dataComponent}
      hidden={hidden}
      role={role}
    />
  )
})

export type AriaStatusProps = Omit<AnnounceProps, 'politeness'>

export const AriaStatus = React.forwardRef<HTMLElement, AriaStatusProps>(function AriaStatus(
  {announceOnShow = false, 'data-component': dataComponent = 'AriaStatus', ...rest},
  ref,
) {
  return (
    <Announce {...rest} announceOnShow={announceOnShow} data-component={dataComponent} politeness="polite" ref={ref} />
  )
})

export type AriaAlertProps = Omit<AnnounceProps, 'politeness'>

export const AriaAlert = React.forwardRef<HTMLElement, AriaAlertProps>(function AriaAlert(
  {announceOnShow = true, 'data-component': dataComponent = 'AriaAlert', ...rest},
  ref,
) {
  return (
    <Announce
      {...rest}
      announceOnShow={announceOnShow}
      data-component={dataComponent}
      politeness="assertive"
      ref={ref}
    />
  )
})
