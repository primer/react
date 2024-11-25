import React from 'react'
import styled, {keyframes} from 'styled-components'
import sx, {merge, type SxProp} from '../../sx'
import {get} from '../../constants'
import {type CSSProperties, type HTMLProps} from 'react'
import {toggleStyledComponent} from '../../internal/utils/toggleStyledComponent'
import {clsx} from 'clsx'
import classes from './SkeletonBox.module.css'
import {useFeatureFlag} from '../../FeatureFlags'
import {CSS_MODULE_FLAG} from './FeatureFlag'

type SkeletonBoxProps = {
  /** Height of the skeleton "box". Accepts any valid CSS `height` value. */
  height?: CSSProperties['height']
  /** Width of the skeleton "box". Accepts any valid CSS `width` value. */
  width?: CSSProperties['width']
  /** The className of the skeleton box */
  className?: string
} & SxProp &
  HTMLProps<HTMLDivElement>

const shimmer = keyframes`
  from { mask-position: 200%; }
  to { mask-position: 0%; }
`

const StyledSkeletonBox = toggleStyledComponent(
  CSS_MODULE_FLAG,
  'div',
  styled.div<SkeletonBoxProps>`
    animation: ${shimmer};
    display: block;
    background-color: var(--skeletonLoader-bgColor, ${get('colors.canvas.subtle')});
    border-radius: 3px;
    height: ${props => props.height || '1rem'};
    width: ${props => props.width};

    @media (prefers-reduced-motion: no-preference) {
      mask-image: linear-gradient(75deg, #000 30%, rgba(0, 0, 0, 0.65) 80%);
      mask-size: 200%;
      animation: ${shimmer};
      animation-duration: 1s;
      animation-iteration-count: infinite;
    }

    @media (forced-colors: active) {
      outline: 1px solid transparent;
      outline-offset: -1px;
    }

    ${sx};
  `,
)

export const SkeletonBox = React.forwardRef<HTMLDivElement, SkeletonBoxProps>(function SkeletonBox(
  {height, width, className, style, ...props},
  ref,
) {
  const enabled = useFeatureFlag(CSS_MODULE_FLAG)
  return (
    <StyledSkeletonBox
      height={enabled ? undefined : height}
      width={enabled ? undefined : width}
      className={clsx(className, {[classes.SkeletonBox]: enabled})}
      style={
        enabled
          ? merge(
              style as CSSProperties,
              {
                height,
                width,
              } as CSSProperties,
            )
          : style
      }
      {...props}
      ref={ref}
    />
  )
})
