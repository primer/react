import React from 'react'
import {clsx} from 'clsx'
import styled from 'styled-components'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import {useFeatureFlag} from '../FeatureFlags'
import Box from '../Box'
import classes from './BranchName.module.css'
import {forwardRef} from '../utils/fixedForwardRef'

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
  ${sx};
`

type BranchNameProps<As extends React.ElementType> = {
  as?: As
} & DistributiveOmit<React.ComponentPropsWithRef<React.ElementType extends As ? 'a' : As>, 'as'> &
  SxProp

type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any ? Omit<T, TOmitted> : never

const BranchName = forwardRef(function BranchName<As extends React.ElementType>(
  props: BranchNameProps<As>,
  ref: React.ForwardedRef<any>,
) {
  const {as: BaseComponent = 'a', className, children, sx, ...rest} = props
  const enabled = useFeatureFlag('primer_react_css_modules_team')
  if (enabled) {
    if (sx) {
      return (
        <Box {...rest} ref={ref} as={BaseComponent} className={clsx(className, classes.BranchName)} sx={sx}>
          {children}
        </Box>
      )
    }
    return (
      <BaseComponent {...rest} ref={ref} className={clsx(className, classes.BranchName)}>
        {children}
      </BaseComponent>
    )
  }
  return (
    <StyledBranchName {...rest} ref={ref} as={BaseComponent} className={className} sx={sx}>
      {children}
    </StyledBranchName>
  )
})

export type {BranchNameProps}
export default BranchName
