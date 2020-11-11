import React from 'react'
import styled, {createGlobalStyle} from 'styled-components'
import PropTypes from 'prop-types'
import {XIcon} from '@primer/octicons-react'
import StyledOcticon from './StyledOcticon'
import {COMMON, LAYOUT} from './constants'
import theme from './theme'
import sx from './sx'
import Text from './Text'
import Flex from './Flex'

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

const DialogWrapper = styled.div`
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.35);
  background: white;
  border-radius: 4px;
  padding: 0 !important;
  position: fixed;
  margin: 10vh auto;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999999;
  max-height: 80vh;
  max-width: 90vw;

  @media screen and (max-width: 750px) {
    width: 100vw !important;
    margin: 0 !important;
    border-radius: 0;
    height: 100vh;
  }

  ${LAYOUT};
  ${COMMON};
  ${sx};
`

function Dialog({children, ...props}) {
  React.useEffect(() => {
    import('@github/details-dialog-element')
  }, [])
  return (
    <details-dialog>
      <DialogWrapper>
          <UnstyledButton onClick={props.onDismiss} data-close-dialog>
            <StyledOcticon icon={XIcon} />
          </UnstyledButton>
          {children}
      </DialogWrapper>
    </details-dialog>
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
