'use client'

import React from 'react'
import {Avatar} from '../Avatar'
import {flattenChildren} from '../../internal/children'
import {cn} from '../../internal/cn'

const avatarSizes = {small: 20, medium: 32, large: 40, xlarge: 48} as const
const viewports = ['narrow', 'regular', 'wide'] as const
const squareZIndices = ['z-[5]', 'z-[4]', 'z-[3]', 'z-[2]', 'z-[1]'] as const
const expandedItemClassName = 'group-hover:opacity-100 group-focus-within:opacity-100'
const expandedOverlapClassName =
  'group-hover:[--mask-size:100%] group-hover:[mask-position:calc(var(--avatar-stack-size)*var(--mask-start))_center,0_0] group-hover:[margin-inline-start:var(--base-size-4)] group-focus-within:[--mask-size:100%] group-focus-within:[mask-position:calc(var(--avatar-stack-size)*var(--mask-start))_center,0_0] group-focus-within:[margin-inline-start:var(--base-size-4)]'
const expandedHiddenItemClassName =
  'group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100'

type StackStyle = React.CSSProperties & Record<`--${string}`, string | number>
type ResponsiveAvatarSize = Partial<Record<(typeof viewports)[number], number>>
type AvatarChildProps = {
  className?: string
  size?: number | ResponsiveAvatarSize | keyof typeof avatarSizes
  square?: boolean
  style?: React.CSSProperties
}

export interface AvatarStackProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Align the avatars to the right. */
  alignRight?: boolean
  /** Do not spread the avatars on hover or focus. */
  disableExpand?: boolean
  /** The style of overlapping avatars. */
  variant?: 'cascade' | 'stack'
  /** The shape of the avatars. */
  shape?: 'circle' | 'square'
  /** The size of the avatar children in pixels. */
  size?: number | ResponsiveAvatarSize
  /** A set of Avatar components to stack. */
  children: React.ReactNode
}

function sizeInPixels(size: AvatarChildProps['size']) {
  return typeof size === 'number' ? size : typeof size === 'string' ? avatarSizes[size] : 20
}

function getChildSizes(children: React.ReactNode): ResponsiveAvatarSize {
  const childSizes: Record<(typeof viewports)[number], number[]> = {narrow: [], regular: [], wide: []}

  return flattenChildren(children).reduce<ResponsiveAvatarSize>(
    (smallestSizes, child) => {
      if (!React.isValidElement<AvatarChildProps>(child)) return smallestSizes

      for (const viewport of viewports) {
        const size = child.props.size
        childSizes[viewport].push(typeof size === 'object' ? size[viewport] || 20 : sizeInPixels(size))
        smallestSizes[viewport] = Math.min(...childSizes[viewport])
      }

      return smallestSizes
    },
    {narrow: 20, regular: 20, wide: 20},
  )
}

function useHasInteractiveChildren(ref: React.RefObject<HTMLElement | null>) {
  const [hasInteractiveChildren, setHasInteractiveChildren] = React.useState(false)

  React.useEffect(() => {
    const container = ref.current
    if (!container) return

    const findInteractiveChild = () => {
      // The body is deliberately made focusable only after its rendered descendants are known.
      setHasInteractiveChildren(
        Boolean(
          container.querySelector(
            'a[href]:not([disabled]):not([hidden]):not([inert]), button:not([disabled]):not([hidden]):not([inert]), summary:not([disabled]):not([hidden]):not([inert]), select:not([disabled]):not([hidden]):not([inert]), input:not([type=hidden]):not([disabled]):not([hidden]):not([inert]), textarea:not([disabled]):not([hidden]):not([inert]), [tabindex="0"]:not([disabled]):not([hidden]):not([inert]), audio[controls]:not([disabled]):not([hidden]):not([inert]), video[controls]:not([disabled]):not([hidden]):not([inert]), [contenteditable]:not([disabled]):not([hidden]):not([inert])',
          ),
        ),
      )
    }

    // eslint-disable-next-line react-you-might-not-need-an-effect/no-adjust-state-on-prop-change
    findInteractiveChild()
    if (typeof MutationObserver === 'undefined') return

    const observer = new MutationObserver(findInteractiveChild)
    observer.observe(container, {
      attributeFilter: ['contenteditable', 'controls', 'disabled', 'hidden', 'href', 'inert', 'tabindex', 'type'],
      attributes: true,
      childList: true,
      subtree: true,
    })
    return () => observer.disconnect()
  }, [ref])

  return hasInteractiveChildren
}

export const AvatarStack = React.forwardRef<HTMLElement, AvatarStackProps>(function AvatarStack(
  {alignRight, children, className, disableExpand, shape = 'circle', size, style, variant = 'cascade', ...rest},
  ref,
) {
  const stackContainer = React.useRef<HTMLSpanElement>(null)
  const hasInteractiveChildren = useHasInteractiveChildren(stackContainer)
  const count = React.Children.count(children)
  const childSizes = getChildSizes(children)
  const responsiveSize = typeof size === 'object'
  const overlap = 0.55
  const thirdOverlap = variant === 'stack' ? overlap : 0.85
  const visibleCount = Math.min(count, 4)
  const minWidth =
    count < 2
      ? 'var(--avatar-stack-size)'
      : count === 2
        ? 'calc(var(--avatar-stack-size) + (var(--avatar-stack-size) - var(--overlap-size)))'
        : variant === 'cascade'
          ? `calc(var(--avatar-stack-size) + (var(--avatar-stack-size) - var(--overlap-size)) + (var(--avatar-stack-size) - var(--overlap-size-avatar-three-plus)) * ${visibleCount - 2})`
          : `calc(var(--avatar-stack-size) + (var(--avatar-stack-size) - var(--overlap-size-avatar-three-plus)) * ${visibleCount - 1})`
  const stackStyle: StackStyle = {
    ...(typeof size === 'number' && {'--avatar-stack-size': `${size}px`}),
    ...(responsiveSize && {
      '--stack-size-narrow': `${size.narrow || 20}px`,
      '--stack-size-regular': `${size.regular || 20}px`,
      '--stack-size-wide': `${size.wide || 20}px`,
    }),
    ...(!size && {
      '--stack-size-narrow': `${childSizes.narrow}px`,
      '--stack-size-regular': `${childSizes.regular}px`,
      '--stack-size-wide': `${childSizes.wide}px`,
    }),
    '--overlap-size': `calc(var(--avatar-stack-size) * ${overlap})`,
    '--overlap-size-avatar-three-plus': `calc(var(--avatar-stack-size) * ${thirdOverlap})`,
    '--avatar-border-width': '1px',
    '--mask-size': 'calc(100% + (var(--avatar-border-width) * 2))',
    '--mask-start': alignRight ? 1 : -1,
    direction: alignRight ? 'rtl' : 'ltr',
    minWidth,
    ...style,
  }

  return (
    <span
      {...rest}
      ref={ref}
      data-component="AvatarStack"
      data-variant={variant}
      data-shape={shape}
      data-avatar-count={count > 3 ? '3+' : count}
      data-align-right={alignRight ? '' : undefined}
      data-responsive={size === undefined || responsiveSize ? '' : undefined}
      className={cn(
        'relative flex h-[var(--avatar-stack-size)] isolate',
        responsiveSize || !size
          ? '[--avatar-stack-size:var(--stack-size-narrow)] md:[--avatar-stack-size:var(--stack-size-regular)] 2xl:[--avatar-stack-size:var(--stack-size-wide)]'
          : undefined,
        className,
      )}
      style={stackStyle}
    >
      <span
        ref={stackContainer}
        data-component="AvatarStack.Body"
        data-disable-expand={disableExpand ? '' : undefined}
        tabIndex={!hasInteractiveChildren && !disableExpand ? 0 : undefined}
        className={cn('group absolute flex', disableExpand && 'relative')}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement<AvatarChildProps>(child)) return child

          const childOverlap =
            (variant === 'cascade' && index >= 2) || (variant === 'stack' && count > 3)
              ? 'var(--overlap-size-avatar-three-plus)'
              : 'var(--overlap-size)'
          const isDirectImage = child.type === 'img' || child.type === Avatar
          const itemStyle: StackStyle = {
            '--avatar-stack-item-overlap': childOverlap,
            '--avatar-stack-margin': index === 0 ? '0px' : `calc(${childOverlap} * -1)`,
            '--avatar-stack-opacity': variant === 'cascade' && index >= 2 ? Math.max(0.4, 1 - index * 0.15) : 1,
            ...child.props.style,
            width: 'var(--avatar-stack-size)',
            height: 'var(--avatar-stack-size)',
          }

          return React.cloneElement(child, {
            square: shape === 'square' || child.props.square,
            className: cn(
              'relative flex size-[var(--avatar-stack-size)] shrink-0 overflow-hidden [margin-inline-start:var(--avatar-stack-margin)] [opacity:var(--avatar-stack-opacity)] transition-[margin,opacity,mask-position,mask-size] duration-200 ease-in-out',
              !disableExpand && expandedItemClassName,
              index >= 1 &&
                cn(
                  '[mask-repeat:no-repeat,no-repeat] [mask-size:var(--mask-size)_var(--mask-size),auto] [mask-composite:exclude] [mask-position:calc((var(--avatar-stack-size)-var(--avatar-stack-item-overlap))*var(--mask-start)-var(--avatar-border-width))_center,0_0] [padding:0.1px]',
                  !disableExpand && expandedOverlapClassName,
                ),
              shape === 'circle' && 'rounded-[50%]',
              index >= 1 &&
                shape === 'circle' &&
                '[mask-image:radial-gradient(at_50%_50%,rgb(0_0_0)_70%,rgb(0_0_0/0)_71%),linear-gradient(rgb(0_0_0)_0_0)]',
              index >= 1 &&
                shape === 'square' &&
                '[mask-image:linear-gradient(at_50%_50%,rgb(0_0_0)_70%,rgb(0_0_0/0)_71%),linear-gradient(rgb(0_0_0)_0_0)]',
              isDirectImage &&
                (shape === 'circle'
                  ? '[box-shadow:0_0_0_var(--avatar-border-width)_transparent]'
                  : cn(
                      alignRight ? '[box-shadow:-1px_0_rgb(255_255_255)]' : '[box-shadow:1px_0_rgb(255_255_255)]',
                      count === 1 && (alignRight ? '[box-shadow:-1px_0_rgb(0_0_0)]' : '[box-shadow:1px_0_rgb(0_0_0)]'),
                    )),
              shape === 'square' && squareZIndices[index],
              index >= 5 && cn('invisible opacity-0', !disableExpand && expandedHiddenItemClassName),
              child.props.className,
            ),
            style: itemStyle,
          })
        })}
      </span>
    </span>
  )
})

AvatarStack.displayName = 'AvatarStack'
;('use client')
