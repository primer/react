import styled from 'react-emotion'
import * as system from 'styled-system'

export {default as tag} from 'clean-tag'
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

export const FLEX_CONTAINER = LAYOUT.concat(
  'alignItems',
  'justifyContent',
  'flexWrap',
  'flexDirection',
  'flex',
  'alignContent',
  'order',
  'flexBasis'
)

export const FLEX_ITEM = LAYOUT.concat('justifySelf', 'alignSelf')

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
  const composed = props => funcs.reduce((p, fn) => fn(p), props)
  composed.propTypes = getPropTypes(funcs)
  return composed
}

export function getPropTypes(funcs) {
  return funcs.reduce((types, func) => {
    return Object.assign(types, func.propTypes)
  }, {})
}

export function withSystemProps(Component, props) {
  const funcs = getSystemProps(props)
  const Wrapped = styled(Component)(...funcs)
  // Copy over non-system keys from components
  // eg. Tooltip.js => Tooltip.directions Tooltip.alignments
  for (const key of Object.keys(Component)) {
    Wrapped[key] = Component[key]
  }
  Wrapped.propTypes = {
    ...getPropTypes(funcs),
    ...Component.propTypes
  }
  return Wrapped
}
