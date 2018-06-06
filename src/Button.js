import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import map, { classifier } from './props'

function Button(props) {
  const classifyButtonProps = classifier({
    block: 'block',
    scheme: value => `btn-${value}`,
    size: value => `btn-${value}`,
    grouped: 'BtnGroup-item'
  });

  const mapButtonProps = ({ linkStyle, ...rest }) => {
    const newProps = { className: linkStyle ? 'btn-link' : 'btn', ...rest}
    return classifyButtonProps(newProps);
  }

  const Tag = props.tag || 'button';

  return (
    <Tag {...props} className={mapButtonProps(props).className}>
      {props.children}
    </Tag>
  )
}

Button.propTypes = {
  block: PropTypes.bool,
  grouped: PropTypes.bool,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large']),
  tag: PropTypes.oneOf(['button', 'a', 'summary']),
  linkStyle: PropTypes.bool,
}

export default Button
