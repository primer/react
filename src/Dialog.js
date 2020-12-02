import React from 'react'
import {Dialog as ReachDialog} from '@reach/dialog'
import styled, {createGlobalStyle} from 'styled-components'
import PropTypes from 'prop-types'
import {XIcon} from '@primer/octicons-react'
import StyledOcticon from './StyledOcticon'
import {COMMON, LAYOUT, get} from './constants'
import theme from './theme'
import sx from './sx'
import Text from './Text'
import Flex from './Flex'

const ReachGlobalStyle = createGlobalStyle`
  // silences error regarding importing @reach/dialog styles
  :root {
    --reach-dialog: 1;
  }

  [data-reach-dialog-overlay] {
    background: hsla(0, 0%, 0%, 0.33);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    z-index: 1000002; /* Higher than the Dropdown and Tooltip */
  }
`

const StyledDialog = styled(ReachDialog)`
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.35);
  border-radius: ${get('radii.2')};
  position: relative;
  background-color: ${get('colors.white')};
  width: 50vw;
  margin: 10vh auto;
  outline: none;

  @media screen and (max-width: 750px) {
    width: 100vw;
    margin: 0;
    border-radius: 0;
    height: 100vh;
  }

  ${LAYOUT};
  ${COMMON};
  ${sx};
`

const UnstyledButton = styled(Flex).attrs({
  as: 'button'
})`
  background: none;
  border: none;
  padding: 0;

  position: absolute;
  top: 16px;
  right: 16px;
`

const DialogHeaderBase = styled(Flex)`
  border-radius: 4px 4px 0px 0px;
  border-bottom: 1px solid #dad5da;

  @media screen and (max-width: 750px) {
    border-radius: 0px;
  }

  ${sx};
`

function DialogHeader({theme, children, ...rest}) {
  if (React.Children.toArray(children).every(ch => typeof ch === 'string')) {
    children = (
      <Text theme={theme} color="gray.9" fontSize={1} fontWeight="bold" fontFamily="sans-serif">
        {children}
      </Text>
    )
  }

  return (
    <DialogHeaderBase theme={theme} p={3} {...rest}>
      {children}
    </DialogHeaderBase>
  )
}

function Dialog({children, ...props}) {
  return (
    <>
      <StyledDialog role="dialog" {...props}>
        <UnstyledButton onClick={props.onDismiss}>
          <StyledOcticon icon={XIcon} />
        </UnstyledButton>
        {children}
      </StyledDialog>
      <ReachGlobalStyle />
    </>
  )
}

Dialog.defaultProps = {theme}

Dialog.propTypes = {
  ...COMMON.propTypes,
  ...LAYOUT.propTypes,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  ...sx.propTypes,
  theme: PropTypes.object
}

DialogHeader.defaultProps = {
  backgroundColor: 'gray.1',
  theme
}

DialogHeader.propTypes = {
  ...Flex.propTypes
}

DialogHeader.displayName = 'Dialog.Header'

Dialog.Header = DialogHeader
export default Dialog
