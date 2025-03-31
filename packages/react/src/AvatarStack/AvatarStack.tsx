import {clsx} from 'clsx'
import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import Box from '../Box'
import type {BetterCssProperties, BetterSystemStyleObject, SxProp} from '../sx'
import sx, {merge} from '../sx'
import type {AvatarProps} from '../Avatar/Avatar'
import {DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import {getBreakpointDeclarations} from '../utils/getBreakpointDeclarations'
import {defaultSxProp} from '../utils/defaultSxProp'
import type {WidthOnlyViewportRangeKeys} from '../utils/types/ViewportRangeKeys'
import classes from './AvatarStack.module.css'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import {hasInteractiveNodes} from '../internal/utils/hasInteractiveNodes'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'

type StyledAvatarStackWrapperProps = {
  count?: number
} & SxProp

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

const AvatarStackWrapper = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'span',
  styled.span<StyledAvatarStackWrapperProps>`
    --avatar-border-width: 1px;
    --overlap-size: calc(var(--avatar-stack-size) * 0.55);
    --overlap-size-avatar-three-plus: calc(var(--avatar-stack-size) * 0.85);
    --mask-size: calc(100% + (var(--avatar-border-width) * 2));
    --mask-start: -1;
    --opacity-step: 15%;

    display: flex;
    position: relative;
    height: var(--avatar-stack-size);
    min-width: var(--avatar-stack-size);
    isolation: isolate;

    .pc-AvatarStackBody {
      display: flex;
      position: absolute;

      ${getGlobalFocusStyles('1px')}
    }

    .pc-AvatarItem {
      --avatar-size: var(--avatar-stack-size);
      flex-shrink: 0;
      height: var(--avatar-stack-size);
      width: var(--avatar-stack-size);
      position: relative;
      overflow: hidden;
      display: flex;
      transition:
        margin 0.2s ease-in-out,
        opacity 0.2s ease-in-out,
        mask-position 0.2s ease-in-out,
        mask-size 0.2s ease-in-out;

      &:is(img) {
        box-shadow: 0 0 0 var(--avatar-border-width)
          ${props => (props.count === 1 ? get('colors.avatar.border') : 'transparent')};
      }

      &:first-child {
        margin-inline-start: 0;
      }

      &:nth-child(n + 2) {
        margin-inline-start: calc(var(--overlap-size) * -1);
        mask-image: radial-gradient(at 50% 50%, rgb(0, 0, 0) 70%, rgba(0, 0, 0, 0) 71%),
          linear-gradient(rgb(0, 0, 0) 0 0);
        mask-repeat: no-repeat, no-repeat;
        mask-size:
          var(--mask-size) var(--mask-size),
          auto;
        mask-composite: exclude;
        // HORIZONTAL POSITION CALC FORMULA EXPLAINED:
        // width of the visible part of the avatar ➡️ var(--avatar-stack-size) - var(--overlap-size)
        // multiply by -1 for left-aligned, 1 for right-aligned ➡️ var(--mask-start)
        // subtract the avatar border width ➡️ var(--avatar-border-width)
        mask-position:
          calc((var(--avatar-stack-size) - var(--overlap-size)) * var(--mask-start) - var(--avatar-border-width)) center,
          0 0;
        // HACK: This padding fixes a weird rendering bug where a tiiiiny outline is visible at the edges of the element
        padding: 0.1px;
      }

      &:nth-child(n + 3) {
        --overlap-size: var(--overlap-size-avatar-three-plus);
        opacity: calc(100% - 2 * var(--opacity-step));
      }

      &:nth-child(n + 4) {
        opacity: calc(100% - 3 * var(--opacity-step));
      }

      &:nth-child(n + 5) {
        opacity: calc(100% - 4 * var(--opacity-step));
      }

      &:nth-child(n + 6) {
        opacity: 0;
        visibility: hidden;
      }
    }

    &.pc-AvatarStack--two {
      // MIN-WIDTH CALC FORMULA EXPLAINED:
      // avatar size ➡️ var(--avatar-stack-size)
      // plus the visible part of the 2nd avatar ➡️ var(--avatar-stack-size) - var(--overlap-size)
      min-width: calc(var(--avatar-stack-size) + (var(--avatar-stack-size) - var(--overlap-size)));
    }

    &.pc-AvatarStack--three {
      // MIN-WIDTH CALC FORMULA EXPLAINED:
      // avatar size ➡️ var(--avatar-stack-size)
      // plus the visible part of the 2nd avatar ➡️ var(--avatar-stack-size) - var(--overlap-size)
      // plus the visible part of the 3rd avatar ➡️ var(--avatar-stack-size) - var(--overlap-size-avatar-three-plus)
      min-width: calc(
        var(--avatar-stack-size) + (var(--avatar-stack-size) - var(--overlap-size)) +
          (var(--avatar-stack-size) - var(--overlap-size-avatar-three-plus))
      );
    }

    &.pc-AvatarStack--three-plus {
      // MIN-WIDTH CALC FORMULA EXPLAINED:
      // avatar size ➡️ var(--avatar-stack-size)
      // plus the visible part of the 2nd avatar ➡️ var(--avatar-stack-size) - var(--overlap-size)
      // plus the visible part of the 3rd AND 4th avatar ➡️ (var(--avatar-stack-size) - var(--overlap-size-avatar-three-plus)) * 2
      min-width: calc(
        var(--avatar-stack-size) + (var(--avatar-stack-size) - var(--overlap-size)) +
          (var(--avatar-stack-size) - var(--overlap-size-avatar-three-plus)) * 2
      );
    }

    &.pc-AvatarStack--right {
      --mask-start: 1;
      direction: rtl;
    }

    .pc-AvatarStackBody:not(.pc-AvatarStack--disableExpand):hover,
    .pc-AvatarStackBody:not(.pc-AvatarStack--disableExpand):focus-within {
      width: auto;

      .pc-AvatarItem {
        // reset size of the mask to prevent unintentially clipping due to the additional size created by the border width
        --mask-size: 100%;
        margin-inline-start: ${get('space.1')};
        opacity: 1;
        visibility: visible;
        // HORIZONTAL POSITION CALC FORMULA EXPLAINED:
        // width of the full avatar ➡️ var(--avatar-stack-size)
        // multiply by -1 for left-aligned, 1 for right-aligned ➡️ var(--mask-start)
        mask-position:
          calc(var(--avatar-stack-size) * var(--mask-start)) center,
          0 0;

        ${getGlobalFocusStyles('1px')}

        &:first-child {
          margin-inline-start: 0;
        }
      }
    }

    .pc-AvatarStack--disableExpand {
      position: relative;
    }

    ${sx};
  `,
)

const transformChildren = (children: React.ReactNode, enabled: boolean) => {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child
    return React.cloneElement(child, {
      ...child.props,
      className: clsx(child.props.className, 'pc-AvatarItem', {[classes.AvatarItem]: enabled}),
    })
  })
}

export type AvatarStackProps = {
  alignRight?: boolean
  disableExpand?: boolean
  size?: number | ResponsiveValue<number>
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
} & SxProp

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
  const bodyClassNames = clsx('pc-AvatarStackBody', {
    'pc-AvatarStack--disableExpand': disableExpand,
  })
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  if (enabled) {
    return (
      <div
        data-disable-expand={disableExpand ? '' : undefined}
        className={clsx(bodyClassNames, classes.AvatarStackBody)}
        tabIndex={!hasInteractiveChildren && !disableExpand ? 0 : undefined}
        ref={stackContainer}
      >
        {children}
      </div>
    )
  }
  return (
    <Box
      className={bodyClassNames}
      tabIndex={!hasInteractiveChildren && !disableExpand ? 0 : undefined}
      ref={stackContainer}
    >
      {children}
    </Box>
  )
}

const AvatarStack = ({
  children,
  alignRight,
  disableExpand,
  size,
  className,
  style,
  sx: sxProp = defaultSxProp,
}: AvatarStackProps) => {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)
  const [hasInteractiveChildren, setHasInteractiveChildren] = useState<boolean | undefined>(false)
  const stackContainer = useRef<HTMLDivElement>(null)

  const count = React.Children.count(children)
  const wrapperClassNames = clsx(
    {
      'pc-AvatarStack--two': count === 2,
      'pc-AvatarStack--three': count === 3,
      'pc-AvatarStack--three-plus': count > 3,
      'pc-AvatarStack--right': alignRight,
    },
    className,
  )

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
      if (enabled) {
        return {
          '--stackSize-narrow': `${childSizes.narrow}px`,
          '--stackSize-regular': `${childSizes.regular}px`,
          '--stackSize-wide': `${childSizes.wide}px`,
        }
      }

      return getBreakpointDeclarations(
        childSizes,
        '--avatar-stack-size' as keyof React.CSSProperties,
        value => `${value}px`,
      )
    }

    // if the `size` prop is set and responsive, set the `--avatar-stack-size` CSS variable for each viewport
    if (isResponsiveValue(size)) {
      if (enabled) {
        return {
          '--stackSize-narrow': `${size.narrow || DEFAULT_AVATAR_SIZE}px`,
          '--stackSize-regular': `${size.regular || DEFAULT_AVATAR_SIZE}px`,
          '--stackSize-wide': `${size.wide || DEFAULT_AVATAR_SIZE}px`,
        }
      }

      return getBreakpointDeclarations(
        size,
        '--avatar-stack-size' as keyof React.CSSProperties,
        value => `${value || DEFAULT_AVATAR_SIZE}px`,
      )
    }

    // if the `size` prop is set and not responsive, it is a number, so we can just set the `--avatar-stack-size` CSS variable to that number
    return {'--avatar-stack-size': `${size}px`} as React.CSSProperties
  }

  const avatarStackSx = merge<BetterCssProperties | BetterSystemStyleObject>(
    !enabled && getResponsiveAvatarSizeStyles(),
    sxProp as SxProp,
  )

  return (
    <AvatarStackWrapper
      count={enabled ? undefined : count}
      data-avatar-count={enabled ? (count > 3 ? '3+' : count) : undefined}
      data-align-right={enabled && alignRight ? '' : undefined}
      data-responsive={enabled && (!size || isResponsiveValue(size)) ? '' : undefined}
      className={clsx(wrapperClassNames, {[classes.AvatarStack]: enabled})}
      style={enabled ? {...getResponsiveAvatarSizeStyles(), style} : style}
      sx={avatarStackSx}
    >
      <AvatarStackBody
        disableExpand={disableExpand}
        hasInteractiveChildren={hasInteractiveChildren}
        stackContainer={stackContainer}
      >
        {' '}
        {transformChildren(children, enabled)}
      </AvatarStackBody>
    </AvatarStackWrapper>
  )
}

export default AvatarStack
