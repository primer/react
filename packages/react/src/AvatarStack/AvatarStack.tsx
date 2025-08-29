import {clsx} from 'clsx'
import React, {useEffect, useRef, useState} from 'react'
import type {AvatarProps} from '../Avatar/Avatar'
import {DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import type {WidthOnlyViewportRangeKeys} from '../utils/types/ViewportRangeKeys'
import classes from './AvatarStack.module.css'
import {hasInteractiveNodes} from '../internal/utils/hasInteractiveNodes'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

const transformChildren = (children: React.ReactNode, shape: AvatarStackProps['shape']) => {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child, {
      ...child.props,
      square: shape === 'square' ? true : undefined,
      className: clsx(child.props.className, 'pc-AvatarItem', classes.AvatarItem),
    })
  })
}

export type AvatarStackProps = {
  alignRight?: boolean
  disableExpand?: boolean
  variant?: 'cascade' | 'stack'
  shape?: 'circle' | 'square'
  size?: number | ResponsiveValue<number>
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

const AvatarStackBody = ({
  disableExpand,
  hasInteractiveChildren,
  stackContainer,
  children,
}: {
  disableExpand: boolean | undefined
  hasInteractiveChildren: boolean | undefined
  stackContainer: React.RefObject<HTMLDivElement>
} & React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      data-disable-expand={disableExpand ? '' : undefined}
      className={clsx(
        {
          'pc-AvatarStack--disableExpand': disableExpand,
        },
        'pc-AvatarStackBody',
        classes.AvatarStackBody,
      )}
      tabIndex={!hasInteractiveChildren && !disableExpand ? 0 : undefined}
      ref={stackContainer}
    >
      {children}
    </div>
  )
}

const AvatarStack = ({
  children,
  variant = 'cascade',
  shape = 'circle',
  alignRight,
  disableExpand,
  size,
  className,
  style,
}: AvatarStackProps) => {
  const [hasInteractiveChildren, setHasInteractiveChildren] = useState<boolean | undefined>(false)
  const stackContainer = useRef<HTMLDivElement>(null)

  const count = React.Children.count(children)

  const getAvatarChildSizes = () => {
    const avatarSizeMap: Record<WidthOnlyViewportRangeKeys, number[]> = {
      narrow: [],
      regular: [],
      wide: [],
    }

    return React.Children.toArray(children).reduce<Record<WidthOnlyViewportRangeKeys, number>>(
      (acc, child) => {
        // if child is not an Avatar, return the default avatar sizes from the accumulator
        if (!React.isValidElement<AvatarProps>(child)) return acc

        for (const responsiveKey of Object.keys(avatarSizeMap)) {
          // if the child has responsive `size` prop values, push the value to the appropriate viewport property in the avatarSizeMap
          if (isResponsiveValue(child.props.size)) {
            avatarSizeMap[responsiveKey as WidthOnlyViewportRangeKeys].push(
              child.props.size[responsiveKey as WidthOnlyViewportRangeKeys] || DEFAULT_AVATAR_SIZE,
            )
          }
          // otherwise, the size is a number (or undefined), so push the value to all viewport properties in the avatarSizeMap
          else {
            avatarSizeMap[responsiveKey as WidthOnlyViewportRangeKeys].push(child.props.size || DEFAULT_AVATAR_SIZE)
          }

          // set the smallest size in each viewport property as the value for that viewport property in the accumulator
          acc[responsiveKey as WidthOnlyViewportRangeKeys] = Math.min(
            ...avatarSizeMap[responsiveKey as WidthOnlyViewportRangeKeys],
          )
        }

        return acc
      },
      {
        narrow: DEFAULT_AVATAR_SIZE,
        regular: DEFAULT_AVATAR_SIZE,
        wide: DEFAULT_AVATAR_SIZE,
      },
    )
  }
  const childSizes = getAvatarChildSizes()

  useEffect(() => {
    if (stackContainer.current) {
      const interactiveChildren = () => {
        setHasInteractiveChildren(hasInteractiveNodes(stackContainer.current))
      }

      const observer = new MutationObserver(interactiveChildren)

      observer.observe(stackContainer.current, {childList: true})

      // Call on initial render, then call it again only if there's a mutation
      interactiveChildren()

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  const getResponsiveAvatarSizeStyles = () => {
    // if there is no size set on the AvatarStack, use the `size` props of the Avatar children to set the `--avatar-stack-size` CSS variable
    if (!size) {
      return {
        '--stackSize-narrow': `${childSizes.narrow}px`,
        '--stackSize-regular': `${childSizes.regular}px`,
        '--stackSize-wide': `${childSizes.wide}px`,
      }
    }

    // if the `size` prop is set and responsive, set the `--avatar-stack-size` CSS variable for each viewport
    if (isResponsiveValue(size)) {
      return {
        '--stackSize-narrow': `${size.narrow || DEFAULT_AVATAR_SIZE}px`,
        '--stackSize-regular': `${size.regular || DEFAULT_AVATAR_SIZE}px`,
        '--stackSize-wide': `${size.wide || DEFAULT_AVATAR_SIZE}px`,
      }
    }

    // if the `size` prop is set and not responsive, it is a number, so we can just set the `--avatar-stack-size` CSS variable to that number
    return {'--avatar-stack-size': `${size}px`} as React.CSSProperties
  }

  return (
    <BoxWithFallback
      as="span"
      data-variant={variant}
      data-shape={shape}
      data-avatar-count={count > 3 ? '3+' : count}
      data-align-right={alignRight ? '' : undefined}
      data-responsive={!size || isResponsiveValue(size) ? '' : undefined}
      className={clsx(
        {
          'pc-AvatarStack--variant': variant,
          'pc-AvatarStack--shape': shape,
          'pc-AvatarStack--two': count === 2,
          'pc-AvatarStack--three': count === 3,
          'pc-AvatarStack--three-plus': count > 3,
          'pc-AvatarStack--right': alignRight,
        },
        className,
        classes.AvatarStack,
      )}
      style={{...getResponsiveAvatarSizeStyles(), ...style}}
    >
      <AvatarStackBody
        disableExpand={disableExpand}
        hasInteractiveChildren={hasInteractiveChildren}
        stackContainer={stackContainer}
      >
        {' '}
        {transformChildren(children, shape)}
      </AvatarStackBody>
    </BoxWithFallback>
  )
}

export default AvatarStack
