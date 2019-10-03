import styled from 'styled-components'
import Box from './Box'

const ButtonGroup = styled(Box)`
  vertical-align: middle;

  && > * {
    position: relative;
    border-right-width: 0;
    border-radius: 0;

    :first-child {
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      margin-right: 0;
    }
    
    :not(:first-child) {
      margin-left: 0;
      margin-right: 0;
    }

    :last-child {
      border-right-width: 1px;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }

    :focus,
    :active,
    :hover {
      border-right-width: 1px;
      + * {
        border-left-width: 0;
      }
    }

    :focus,
    :active {
      z-index: 1;
    }
  }
`
ButtonGroup.defaultProps = {
  display: 'inline-block'
}
ButtonGroup.propTypes = {
  ...Box.propTypes
}

export default ButtonGroup
