import PropTypes from 'prop-types'
import css from '@styled-system/css'
import { styleFn } from 'styled-system'
import propNames from "./propNames"
import { CSSProp, CssPropName } from '@styled-system/prop-types'
// const theme =

const sx = ((props: {sx: any}) => css(props.sx)) as styleFn

type SxProps = {
  [key in CssPropName]: CSSProp
}

const cssProp = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
  PropTypes.array,
  PropTypes.object
])

const shape = propNames.reduce((acc, name) => {
  Object.assign(acc, {[name]: cssProp})
  return acc
}, {}) as SxProps

export const propTypes = {
  sx: PropTypes.shape(shape)// as SxProp
}

export default sx
