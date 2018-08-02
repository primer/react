import styled from 'react-emotion'
import {compose} from 'ramda'
import * as system from 'styled-system'

export default from 'system-components/emotion'

export const COMMON = ['color', 'space']

export const TYPOGRAPHY = COMMON.concat('fontFamily', 'fontWeight', 'lineHeight')

export const LAYOUT = COMMON.concat(
  'borders',
  'borderColor',
  'borderRadius',
  'boxShadow',
  'display',
  'size',
  'width',
  'height',
  'maxWidth',
  'maxHeight',
  'minWidth',
  'minHeight'
)

export const POSITION = ['position', 'zIndex', 'top', 'right', 'bottom', 'left']

export const FLEX = COMMON.concat(
  LAYOUT, // includes display
  'alignItems',
  'justifyContent',
  'flexWrap',
  'flexDirection',
  'flex',
  'alignContent',
  'justifySelf',
  'alignSelf',
  'order',
  'flexBasis'
)

export function getSystemProps(props) {
  const unique = props.filter((p, i, a) => a.indexOf(p) === i)
  return unique.map(prop => {
    if (typeof system[prop] === 'function') {
      return system[prop]
    } else if (typeof prop === 'function') {
      return prop
    } else {
      throw new Error(`Unknown system prop: "${prop}"`)
    }
  })
}

export function composeSystemProps(props) {
  const funcs = getSystemProps(props)
  const composed = compose(...funcs)
  composed.propTypes = funcs.reduce((types, func) => {
    return Object.assign(types, func.propTypes)
  }, {})
  return composed
}

export function withSystemProps(Component, props) {
  const composed = composeSystemProps(props)
  const Wrapped = styled(Component)(composed)
  Wrapped.propTypes = {
    ...composed.propTypes,
    ...Component.propTypes
  }
  return Wrapped
}
