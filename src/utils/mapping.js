import PropTypes from 'prop-types'
import classnames from 'classnames'
import {breakpoints} from '../props'
import theme from '../theme'

const {colors, fontSizes, radii} = theme
const {bg: bgColors, border: borderColors, ...namedColors} = colors

const identity = d => d

export function mapPropToClassnames(prop, mapValue) {
  return props => {
    if (prop in props) {
      const {[prop]: value, className, ...rest} = props
      return {
        className: classnames(className, mapValue(value, {key: value})),
        ...rest
      }
    }
    return props
  }
}

export function responsive(mapValue) {
  return (value, data) => {
    return Array.isArray(value)
      ? value
          .map((v, i) => ({value: v, brk: breakpoints[i]}))
          .filter(d => d.value !== null)
          .map(({value, brk}) => {
            return mapValue(value, {...data, brk: brk && `-${brk}`, key: value})
          })
      : mapValue(value, {...data, key: value})
  }
}

export const bg = mapPropToClassnames('bg', key => `bg-${key}`)
bg.propTypes = {bg: PropTypes.oneOf(Object.keys(bgColors))}

export const borderColor = mapPropToClassnames('borderColor', key => `border-${key}`)
borderColor.propTypes = {borderColor: PropTypes.oneOf(Object.keys(borderColors))}

export const color = mapPropToClassnames('color', key => {
  const k = Array.isArray(namedColors[key]) ? `${key}.5` : key
  return `color-${k.replace(/\./g, '-')}`
})
const colorNames = Object.keys(namedColors).concat(getNestedKeys(namedColors))
color.propTypes = {color: PropTypes.oneOf(colorNames)}

export const fontSize = mapPropToClassnames('fontSize', responsive(expander('f{brk}-{key}')))
fontSize.propTypes = {fontSize: PropTypes.oneOf(range(0, fontSizes.length - 1))}

export const borderRadius = mapPropToClassnames('borderRadius', responsive(expander('r{brk}-{key}')))
borderRadius.propTypes = {borderRadius: PropTypes.oneOf(range(0, radii.length - 1))}

function getNestedKeys(obj) {
  return Object.keys(obj).reduce((list, key) => {
    const value = obj[key]
    if (Array.isArray(value)) {
      list.push(...value.map((sub, i) => [key, i].join('.')))
    }
    /* else if (value && typeof value === 'object') {
      list.push(...Object.keys(value).map(sub => [key, sub].join('.')))
    } */
    return list
  }, [])
}

function expander(template) {
  return (value, subs) => {
    return template.replace(/{(\w+)}/g, (_, key) => {
      return defined(subs[key], '')
    })
  }
}

function defined(d, fallback) {
  return d === null || typeof d === 'undefined' ? fallback : d
}

function range(start, end) {
  const numbers = []
  for (let i = start; i <= end; i++) {
    numbers.push(i)
  }
  return numbers
}
