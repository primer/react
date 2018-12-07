import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import StyledOcticon from './StyledOcticon'
import {TriangleDown} from '@githubprimer/octicons-react'
import Button from './Button'
import BorderBox from './BorderBox'
import Caret from './Caret'
import Details from './Details'
import Flex from './Flex'
import {COMMON} from './constants'
import theme from './theme'

// eslint-disable-next-line no-unused-vars
function proto({title, scheme, children, theme, className, ...rest}) {
  const {minWidth} = rest
  return (
    <div className={classnames(className, 'BtnGroup')} {...rest}>
      <Flex is={Details} className="BtnGroup-form" css={{position: 'relative'}}>
        {({toggle}) => (
          <React.Fragment>
            <Button is="summary" scheme={scheme} grouped onClick={toggle}>
              {title}
              <StyledOcticon icon={TriangleDown} size={14} ml={title ? 2 : 0} />
            </Button>
            <BorderBox
              bg="white"
              border={1}
              borderColor="gray.2"
              borderRadius={1}
              boxShadow="small"
              mt={1}
              px={3}
              py={2}
              minWidth={minWidth}
              css={{position: 'absolute', zIndex: 99999}}
            >
              {children}
              <Caret location="top-left" />
            </BorderBox>
          </React.Fragment>
        )}
      </Flex>
    </div>
  )
}

const Dropdown = styled(proto)(COMMON)

Dropdown.defaultProps = {
  theme
}

Dropdown.propTypes = {
  children: PropTypes.node,
  scheme: Button.propTypes.scheme,
  title: PropTypes.string,
  ...COMMON.propTypes
}

export default Dropdown
