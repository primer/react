import styled from 'styled-components'
import React from 'react'
import {get} from '../constants'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './ButtonGroup.module.css'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'

const StyledButtonGroup = toggleStyledComponent(
  'primer_react_css_modules_team',
  styled.div`
    display: inline-flex;
    vertical-align: middle;
    isolation: isolate;

    && > *:not([data-loading-wrapper]) {
      margin-inline-end: -1px;
      position: relative;
      border-radius: 0;

      :first-child {
        border-top-left-radius: ${get('radii.2')};
        border-bottom-left-radius: ${get('radii.2')};
      }

      :last-child {
        border-top-right-radius: ${get('radii.2')};
        border-bottom-right-radius: ${get('radii.2')};
      }

      :focus,
      :active,
      :hover {
        z-index: 1;
      }
    }

    // if child is loading button
    [data-loading-wrapper] {
      :first-child {
        button,
        a {
          border-top-left-radius: ${get('radii.2')};
          border-bottom-left-radius: ${get('radii.2')};
        }
      }

      :last-child {
        button,
        a {
          border-top-right-radius: ${get('radii.2')};
          border-bottom-right-radius: ${get('radii.2')};
        }
      }
    }

    [data-loading-wrapper] > * {
      margin-inline-end: -1px;
      position: relative;
      border-radius: 0;

      :focus,
      :active,
      :hover {
        z-index: 1;
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
  return (
    <StyledButtonGroup
      ref={forwardRef}
      className={clsx(className, {
        [classes.ButtonGroup]: enabled,
      })}
      {...rest}
    >
      {children}
    </StyledButtonGroup>
  )
})
export default ButtonGroup
