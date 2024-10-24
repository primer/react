import styled from 'styled-components'
import React from 'react'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './ButtonGroup.module.css'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'

const StyledButtonGroup = toggleStyledComponent(
  'primer_react_css_modules_team',
  'div',
  styled.div`
    display: inline-flex;
    vertical-align: middle;
    isolation: isolate;

    & > *:not([data-loading-wrapper]) {
      /* stylelint-disable-next-line primer/spacing */
      margin-inline-end: -1px;
      position: relative;

      /* reset border-radius */
      button,
      a {
        border-radius: 0;
      }

      &:first-child {
        button,
        a {
          border-top-left-radius: var(--borderRadius-medium);
          border-bottom-left-radius: var(--borderRadius-medium);
        }
      }

      &:last-child {
        button,
        a {
          border-top-right-radius: var(--borderRadius-medium);
          border-bottom-right-radius: var(--borderRadius-medium);
        }
      }

      &:focus,
      &:active,
      &:hover {
        z-index: 1;
      }
    }

    /* if child is loading button */
    & > *[data-loading-wrapper] {
      /* stylelint-disable-next-line primer/spacing */
      margin-inline-end: -1px;
      position: relative;
      /* reset border-radius */
      button,
      a {
        border-radius: 0;
      }

      &:focus,
      &:active,
      &:hover {
        z-index: 1;
      }
      &:first-child {
        button,
        a {
          border-top-left-radius: var(--borderRadius-medium);
          border-bottom-left-radius: var(--borderRadius-medium);
        }
      }

      &:last-child {
        button,
        a {
          border-top-right-radius: var(--borderRadius-medium);
          border-bottom-right-radius: var(--borderRadius-medium);
        }
      }
    }

    ${sx};
  `,
)

export type ButtonGroupProps = ComponentProps<typeof StyledButtonGroup>
const ButtonGroup = React.forwardRef<HTMLElement, ButtonGroupProps>(function ButtonGroup(
  {children, className, ...rest},
  forwardRef,
) {
  const enabled = useFeatureFlag('primer_react_css_modules_team')
  const buttons = React.Children.map(children, (child, index) => <div key={index}>{child}</div>)
  return (
    <StyledButtonGroup
      ref={forwardRef}
      className={clsx(className, {
        [classes.ButtonGroup]: enabled,
      })}
      {...rest}
    >
      {buttons}
    </StyledButtonGroup>
  )
})

// const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
//   ({children, sx = defaultSxProp, ...rest}: ButtonGroupProps, forwardedRef) => {
//     const ref = useProvidedRefOrCreate(forwardedRef as React.RefObject<HTMLDivElement>)
//     const buttons = React.Children.map(children, (child, index) => <Box key={index}>{child}</Box>)

//     return (
//       <StyledButtonGroup ref={ref} sx={sx} {...rest}>
//         {buttons}
//       </StyledButtonGroup>
//     )
//   },
// )

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup
