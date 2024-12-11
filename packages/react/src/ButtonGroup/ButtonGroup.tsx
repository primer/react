import styled from 'styled-components'
import React from 'react'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './ButtonGroup.module.css'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import {useProvidedRefOrCreate} from '../hooks'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

const StyledButtonGroup = toggleStyledComponent(
  'primer_react_css_modules_ga',
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

    /* this is a workaround until portal based tooltips are fully removed from dotcom */
    &:has(div:last-child:empty) {
      button,
      a {
        border-radius: var(--borderRadius-medium);
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
  {children, className, role, ...rest},
  forwardRef,
) {
  const enabled = useFeatureFlag('primer_react_css_modules_ga')
  const buttons = React.Children.map(children, (child, index) => <div key={index}>{child}</div>)
  const buttonRef = useProvidedRefOrCreate(forwardRef as React.RefObject<HTMLDivElement>)

  useFocusZone({
    containerRef: buttonRef,
    disabled: role !== 'toolbar',
    bindKeys: FocusKeys.ArrowHorizontal,
    focusOutBehavior: 'wrap',
  })

  return (
    <StyledButtonGroup
      ref={buttonRef}
      className={clsx(className, {
        [classes.ButtonGroup]: enabled,
      })}
      role={role}
      {...rest}
    >
      {buttons}
    </StyledButtonGroup>
  )
}) as PolymorphicForwardRefComponent<'div', ButtonGroupProps>

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup
