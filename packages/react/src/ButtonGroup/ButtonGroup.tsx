import styled from 'styled-components'
import {get} from '../constants'
import {type SxProp} from '../sx'
import React from 'react'
import Box from '../Box'
import {defaultSxProp} from '../utils/defaultSxProp'

export type ButtonGroupProps = SxProp & React.ComponentPropsWithoutRef<'div'>

function ButtonGroup({children, sx = defaultSxProp, ...rest}: React.PropsWithChildren<ButtonGroupProps>) {
  const buttons = React.Children.map(children, (child, index) => (
    <Box key={index} {...rest}>
      {child}
    </Box>
  ))

  return <StyledButtonGroup sx={sx}>{buttons}</StyledButtonGroup>
}

const StyledButtonGroup = styled.div`
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

export default ButtonGroup
