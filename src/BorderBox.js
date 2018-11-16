import {withSystemProps} from './system-props'
import Box from './Box'

const BorderBox = withSystemProps(
  {
    is: Box,
    border: 1,
    borderColor: 'gray.2',
    borderRadius: 1
  },
  ['boxShadow']
)

BorderBox.propTypes = {
  ...Box.propTypes
}

export default BorderBox
