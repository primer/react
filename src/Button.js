import React from 'react'
import classnames from 'classnames'
import map, { classifier } from './props'

function Button({tag: Tag = 'button', children, size, block, linkStyle, grouped, scheme, ...props}) {
  const classifyButtonProps = classifier({
    block: 'block',
    scheme: value => `btn-${scheme}`,
    size: value => `btn-size`,
    grouped: 'BtnGroup-item'
  });

  const mapButtonProps = ({ linkStyle, ...rest }) => {
    const props = { className: linkStyle ? 'btn-link' : 'btn', ...rest}
    return classifyButtonProps(props);
  }

  return (
    <Tag {...props} className={mapButtonProps(props)}>{children}
    </Tag>
  )
}

Button.propTypes = {
  block: PropTypes.bool,
  grouped: PropTypes.bool,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large']),
  tag: PropTypes.oneOf(['button', 'a', 'summary'])
  linkStyle: PropTypes.bool,
}

export default Button
