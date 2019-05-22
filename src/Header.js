import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {MarkGithub, ChevronRight} from '@githubprimer/octicons-react'
import {Text, Link, Flex, Sticky, BorderBox, Box, StyledOcticon} from '@primer/components'
import Search from './Search'
import Hide from './Hide'

const BoxShadow = styled(Box)`
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
`

const HeaderText = props => <Text fontFamily="mono" fontSize={2} color="blue.4" {...props} />

const Header = ({next, title, subtitle, root, subfolder, documents, children}) => (
  <Sticky zIndex={999}>
    <BoxShadow py={3} bg="black" color="white">
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Link href={root} color="white" ml={5}>
            <StyledOcticon color="blue.4" icon={MarkGithub} size="medium" />
          </Link>
          <Hide display={['none', 'inline-block', 'inline-block', 'inline-block']}>
            <Link href={root} mr={2} ml={3}>
              <HeaderText>{title}</HeaderText>
            </Link>
            {subfolder && <StyledOcticon icon={ChevronRight} mx={1} color="blue.4" />}
          </Hide>
          {subfolder && (
            <Link href={`${root}/${subfolder}`} ml={2} mr={4}>
              <HeaderText>{subtitle}</HeaderText>
            </Link>
          )}
          {subfolder && (
            <Hide display={['none', 'none', 'none', 'flex']}>
              <Search next documents={documents} subfolder={subfolder} />
            </Hide>
          )}
        </Flex>
        <Hide display={['none', 'none', 'none', 'flex']}>{children}</Hide>
        <Hide display={['flex', 'flex', 'flex', 'none']}>
          <Link href="#jumpnav">
            <BorderBox
              border={1}
              borderColor="gray.6"
              borderRadius={3}
              color="white"
              display="inline-block"
              px="12px"
              py="6px"
              mr={3}
            >
              <Text fontWeight="bold" color="blue.2" fontSize={1}>
                Menu
              </Text>
            </BorderBox>
          </Link>
          {subfolder && <Search next={next} documents={documents} root={root} />}
        </Hide>
      </Flex>
    </BoxShadow>
  </Sticky>
)

Header.propTypes = {
  root: PropTypes.string.isRequired,
  subfolder: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default Header
