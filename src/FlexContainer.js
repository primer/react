import {tag, withSystemProps, FLEX_CONTAINER} from './system-props'

const FlexContainer = withSystemProps(tag.div, FLEX_CONTAINER)

FlexContainer.defaultProps = {
  display: 'flex'
}

export default FlexContainer
