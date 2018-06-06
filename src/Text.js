import React from 'react'
import PropTypes from 'prop-types'
import chameleon from './chameleon'
import map, {classifier, valueMapper} from './props'

const classifyTextProps = classifier({
  color: value => `text-${value}`,
  fontSize: valueMapper({
    0: '6',
    1: '5',
    2: '4',
    3: '3',
    4: '2',
    5: '1',
    6: '0',
  }, value => `f${value}`, true),
  fontWeight: value => `text-${value}`,
  lineHeight: value => `lh-${value}`,
  mono: 'text-mono'
})

const textProps = props => classifyTextProps(map(props))

const Text = chameleon('span', textProps, true)

Text.propTypes = {
  // TODO: constrain with PropTypes.oneOf()
  color: PropTypes.string,
  // TODO constrain with PropTypes.oneOf()
  fontSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  fontWeight: PropTypes.oneOf(['normal', 'bold', 'semibold']),
  lineHeight: PropTypes.oneOf(['normal', 'condensed', 'condensed-ultra']),
  mono: PropTypes.bool
}

export default Text
