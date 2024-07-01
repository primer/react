import styled from 'styled-components'
import {get} from '../constants'
import {type SxProp} from '../sx'
import React from 'react'
import Box from '../Box'
import {defaultSxProp} from '../utils/defaultSxProp'
import type {ComponentProps} from '../utils/types'
import {useProvidedRefOrCreate} from '../hooks'

export type ButtonGroupProps = React.PropsWithChildren<SxProp & ComponentProps<typeof StyledButtonGroup>>

const StyledButtonGroup = styled.div<SxProp>`
  display: inline-flex;
  vertical-align: middle;
  isolation: isolate;

  && :is(button, a) {
    margin-inline-end: -1px;
    position: relative;
    border-radius: 0;

    :focus,
    :active,
    :hover {
      z-index: 1;
    }
  }

  && > :first-child :is(button, a) {
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
  }

  && > :last-child :is(button, a) {
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
  }
`
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({children, sx = defaultSxProp, ...rest}: ButtonGroupProps, forwardedRef) => {
    const ref = useProvidedRefOrCreate(forwardedRef as React.RefObject<HTMLDivElement>)
    const buttons = React.Children.map(children, (child, index) => (
      <Box ref={ref} key={index} {...rest}>
        {child}
      </Box>
    ))

    return <StyledButtonGroup sx={sx}>{buttons}</StyledButtonGroup>
  },
)

export default ButtonGroup
