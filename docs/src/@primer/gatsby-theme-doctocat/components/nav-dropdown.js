import {Box, StyledOcticon, Details, useDetails, Text, themeGet} from '@primer/components'
import {TriangleDownIcon} from '@primer/octicons-react'
import React from 'react'
import styled from 'styled-components'

// Temporarily shadowing this component until Doctocat uses the
// latest version of the Details or ActionMenu component

function NavDropdown({title, children}) {
  const {getDetailsProps} = useDetails({closeOnOutsideClick: true})
  return (
    <Details {...getDetailsProps()}>
      <summary style={{cursor: 'pointer'}}>
        <Text>{title}</Text>
        <StyledOcticon icon={TriangleDownIcon} ml={1} />
      </summary>
      <Box position="absolute">
        <Box
          color="white"
          bg="gray.8"
          py={1}
          mt={2}
          boxShadow="medium"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="gray.7"
          borderRadius={2}
        >
          {children}
        </Box>
      </Box>
    </Details>
  )
}

export const NavDropdownItem = styled.a`
  display: block;
  padding: ${themeGet('space.2')} ${themeGet('space.3')};
  color: inherit;
  text-decoration: none;
  &:hover {
    color: ${themeGet('colors.white')};
    background-color: ${themeGet('colors.blue.5')};
    text-decoration: none;
  }
`

export default NavDropdown
