import {clsx} from 'clsx'
import type React from 'react'
import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from 'react'
import {VisuallyHidden} from '../VisuallyHidden'
import type {HTMLDataAttributes} from '../internal/internal-types'
import {useId} from '../hooks'
import classes from './Spinner.module.css'
import {useMedia} from '../hooks/useMedia'
import {useFeatureFlag} from '../FeatureFlags'

const sizeMap = {
  small: '16px',
  medium: '32px',
  large: '64px',
}

export type SpinnerProps = {
  /** Sets the width and height of the spinner. */
  size?: keyof typeof sizeMap
  /** Sets the text conveyed by assistive technologies such as screen readers. Set to `null` if the loading state is displayed in a text node somewhere else on the page. */
  srText?: string | null
  /** @deprecated Use `srText` instead. */
  'aria-label'?: string
  className?: string
  style?: React.CSSProperties
  /** Whether to delay the spinner before rendering by the defined 1000ms. */
  delay?: boolean
} & HTMLDataAttributes

function Spinner({
  size: sizeKey = 'medium',
  srText = 'Loading',
  'aria-label': ariaLabel,
  className,
  style,
  delay = false,
  ...props
}: SpinnerProps) {
  const syncAnimationsEnabled = useFeatureFlag('primer_react_spinner_synchronize_animations')
  const animationRef = useSpinnerAnimation()
  const size = sizeMap[sizeKey]
  const hasHiddenLabel = srText !== null && ariaLabel === undefined
  const labelId = useId()

  const [isVisible, setIsVisible] = useState(!delay)

  useEffect(() => {
    if (delay) {
      const timeoutId = setTimeout(() => {
        setIsVisible(true)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }, [delay])

  if (!isVisible) {
    return null
  }

  return (
    /* inline-flex removes the extra line height */
    <span className={classes.Box}>
      <svg
        ref={syncAnimationsEnabled ? animationRef : undefined}
        height={size}
        width={size}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        aria-label={ariaLabel ?? undefined}
        aria-labelledby={hasHiddenLabel ? labelId : undefined}
        className={clsx(className, classes.SpinnerAnimation)}
        style={style}
        {...props}
      >
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M15 8a7.002 7.002 0 00-7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {hasHiddenLabel ? <VisuallyHidden id={labelId}>{srText}</VisuallyHidden> : null}
    </span>
  )
}

Spinner.displayName = 'Spinner'

type Subscriber = () => void

type AnimationTimingValue = {
  startTime: CSSNumberish | null
}

type AnimationTimingStore = {
  subscribers: Set<Subscriber>
  value: AnimationTimingValue
  update(startTime: CSSNumberish): void
  subscribe(subscriber: Subscriber): () => void
  getSnapshot(): AnimationTimingValue
  getServerSnapshot(): AnimationTimingValue
}

const animationTimingStore: AnimationTimingStore = {
  subscribers: new Set<() => void>(),
  value: {
    startTime: null,
  },
  update(startTime) {
    const value = {
      startTime,
    }
    animationTimingStore.value = value
    for (const subscriber of animationTimingStore.subscribers) {
      subscriber()
    }
  },
  subscribe(subscriber) {
    animationTimingStore.subscribers.add(subscriber)
    return () => {
      animationTimingStore.subscribers.delete(subscriber)
    }
  },
  getSnapshot() {
    return animationTimingStore.value
  },
  getServerSnapshot() {
    return animationTimingStore.value
  },
}

/**
 * A utility hook for reading a common `startTime` value so that all animations
 * are in sync. This is a global value and is coordinated through `useSyncExternalStore`.
 */
function useAnimationTiming() {
  return useSyncExternalStore(
    animationTimingStore.subscribe,
    animationTimingStore.getSnapshot,
    animationTimingStore.getServerSnapshot,
  )
}

/**
 * Uses a technique from Spectrum to coordinate animations:
 * @see https://github.com/adobe/react-spectrum/blob/ab5e6f3dba4235dafab9f81f8b5c506ce5f11230/packages/%40react-spectrum/s2/src/Skeleton.tsx#L21
 */
function useSpinnerAnimation() {
  const ref = useRef<Animation | null>(null)
  const noMotionPreference = useMedia('(prefers-reduced-motion: no-preference)', false)
  const animationTiming = useAnimationTiming()
  return useCallback(
    (element: HTMLElement | SVGSVGElement | null) => {
      if (!element) {
        return
      }

      if (ref.current !== null) {
        return
      }

      if (noMotionPreference) {
        const cssAnimation = element.getAnimations().find((animation): animation is CSSAnimation => {
          if (animation instanceof CSSAnimation) {
            return animation.animationName.startsWith('Spinner') && animation.animationName.endsWith('rotate-keyframes')
          }
          return false
        })
        // If we can find a CSS Animation, pause it and we will use the Web
        // Animations API to pick up from where it left off
        cssAnimation?.pause()

        ref.current = element.animate(
          [
            {
              transform: 'rotate(0deg)',
            },
            {
              transform: 'rotate(360deg)',
            },
          ],
          {
            // var(--base-duration-1000)
            duration: 1000,
            // var(--base-easing-linear)
            easing: 'cubic-bezier(0,0,1,1)',
            iterations: Infinity,
          },
        )

        // When the `startTime` value from `animationTimingStore` is `null` we
        // are currently hydrating on the client. In this case, the first
        // spinner to mount will set the `startTime` for all other spinners.
        if (animationTiming.startTime === null) {
          const startTime = cssAnimation?.startTime ?? 0

          animationTimingStore.update(startTime)

          // We use `startTime` to sync different animations. When all animations
          // have the same startTime they will be in sync.
          // @see https://developer.mozilla.org/en-US/docs/Web/API/Animation/startTime#syncing_different_animations
          ref.current.startTime = startTime
        } else {
          ref.current.startTime = animationTiming.startTime
        }
      }
    },
    [noMotionPreference, animationTiming],
  )
}

export default Spinner
