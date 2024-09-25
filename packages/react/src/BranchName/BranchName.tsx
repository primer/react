import React from 'react'
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
  ${sx};
`

type BranchNameProps<As extends React.ElementType> = {
  as?: As
} & React.ComponentPropsWithoutRef<React.ElementType extends As ? 'a' : As> &
  SxProp

function BranchName<As extends React.ElementType>(props: BranchNameProps<As>) {
  const {as: BaseComponent = 'a', className, children, sx, ...rest} = props
  const enabled = useFeatureFlag('primer_react_css_modules_team')
  if (enabled) {
    if (sx) {
      return (
        <Box {...rest} as={BaseComponent} className={clsx(className, classes.BranchName)} sx={sx}>
          {children}
        </Box>
      )
    }
    return (
      <BaseComponent {...rest} className={clsx(className, classes.BranchName)}>
        {children}
      </BaseComponent>
    )
  }
  return (
    <StyledBranchName {...rest} as={BaseComponent} className={className} sx={sx}>
      {children}
    </StyledBranchName>
  )
}

export type {BranchNameProps}
export default BranchName
