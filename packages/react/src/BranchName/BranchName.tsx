import React, {type ForwardedRef} from 'react'
import {clsx} from 'clsx'
import styled from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import {useFeatureFlag} from '../FeatureFlags'
import Box from '../Box'
import classes from './BranchName.module.css'

const StyledBranchName = styled.a<SxProp>`
  display: inline-block;
  padding: 2px 6px;
  font-size: var(--text-body-size-small, ${get('fontSizes.0')});
  font-family: var(--fontStack-monospace, ${get('fonts.mono')});
  color: var(--fgColor-link, ${get('colors.accent.fg')});
  background-color: var(--bgColor-accent-muted, ${get('colors.accent.subtle')});
  border-radius: var(--borderRadius-medium, ${get('radii.2')});
  text-decoration: none;
  &:is(:not(a)) {
    color: var(--fgColor-muted);
  }
  [data-a11y-link-underlines='true'] &:where([data-inline='true']) {
    text-decoration: underline;
  }
  ${sx};
`

type ElementProps =
  | {
      inline?: never
    }
  | {
      as?: 'a'
      inline?: boolean
    }

type BranchNameProps<As extends React.ElementType> = {
  as?: As
} & DistributiveOmit<React.ComponentPropsWithRef<React.ElementType extends As ? 'a' : As>, 'as'> &
  SxProp &
  ElementProps

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BranchName<As extends React.ElementType>(props: BranchNameProps<As>, ref: ForwardedRef<any>) {
  const {as: BaseComponent = 'a', className, children, inline, sx, ...rest} = props
  const enabled = useFeatureFlag('primer_react_css_modules_ga')
  if (enabled) {
    if (sx) {
      return (
        <Box
          {...rest}
          ref={ref}
          as={BaseComponent}
          data-inline={inline}
          className={clsx(className, classes.BranchName)}
          sx={sx}
        >
          {children}
        </Box>
      )
    }

    return (
      <BaseComponent {...rest} ref={ref} data-inline={inline} className={clsx(className, classes.BranchName)}>
        {children}
      </BaseComponent>
    )
  }

  return (
    <StyledBranchName {...rest} as={BaseComponent} ref={ref} className={className} data-inline={inline} sx={sx}>
      {children}
    </StyledBranchName>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-types
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode

const fixedForwardRef = React.forwardRef as FixedForwardRef

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any ? Omit<T, TOmitted> : never

BranchName.displayName = 'BranchName'

export type {BranchNameProps}
export default fixedForwardRef(BranchName)
