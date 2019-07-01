import React from 'react'
import {Dialog as ReachDialog} from '@reach/dialog'
import reachStyles from '@reach/dialog/styles.css'
import styled, {createGlobalStyle} from 'styled-components'
import PropTypes from 'prop-types'
import {space, color} from 'styled-system'
import systemPropTypes from '@styled-system/prop-types'
import {X} from '@primer/octicons-react'
import StyledOcticon from './StyledOcticon'
import {LAYOUT} from './constants'
import theme from './theme'
import Text from './Text'
import Flex from './Flex'

const ReachGlobalStyle = createGlobalStyle`
  ${reachStyles}

  [data-reach-dialog-overlay] {
    z-index: 1000002; /* Higher than the Dropdown and Tooltip */
  }
`

export const Dialog = styled(ReachDialog)`
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.35);
  border-radius: 4px;
  padding: 0 !important;

  @media screen and (max-width: 750px) {
    width: 100vw !important;
    margin: 0 !important;
    border-radius: 0;
    height: 100vh;
  }

  ${LAYOUT}
  ${space}
  ${color}
`

const UnstyledButton = styled(Flex).attrs({
  as: 'button'
})`
  background: none;
  border: none;
  padding: none;
`

const DialogHeader = styled(Flex).attrs({
  p: 3,
  bg: 'gray.1',
  justifyContent: 'space-between',
  alignItems: 'center'
})`
  border-radius: 4px 4px 0px 0px;
  border-bottom: 1px solid #dad5da;

  @media screen and (max-width: 750px) {
    border-radius: 0px;
  }
`

Dialog.defaultProps = {theme}

Dialog.propTypes = {
  ...LAYOUT.propTypes,
  ...systemPropTypes.space,
  ...systemPropTypes.color,
  theme: PropTypes.object
}

const DialogWithHeader = ({title, children, ...props}) => {
  return (
    <>
      <Dialog {...props}>
        <DialogHeader>
          <Text fontSize={1} fontWeight="bold" fontFamily="sans-serif">
            {title}
          </Text>
          <UnstyledButton onClick={props.onDismiss}>
            <StyledOcticon icon={X} />
          </UnstyledButton>
        </DialogHeader>
        {children}
      </Dialog>
      <ReachGlobalStyle />
    </>
  )
}

DialogWithHeader.defaultProps = {theme}

DialogWithHeader.propTypes = {
  ...LAYOUT.propTypes,
  ...systemPropTypes.space,
  ...systemPropTypes.color,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  theme: PropTypes.object,
  title: PropTypes.string.isRequired
}

export default DialogWithHeader
