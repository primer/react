import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Toggle from './Toggle'

function getRenderer(children) {
  return typeof children === 'function'
    ? children
    : () => children
}

export default class Details extends React.PureComponent {

  render() {
    const {
      children,
      render = getRenderer(children),
    } = this.props
    return (
      <Toggle>{({open, toggle}) => (
        <details open={open}>
          {render(children, {open, toggle})}
        </details>
      )}</Toggle>
    )
  }
}

Details.propTypes = {
  open: PropTypes.bool,
  render: PropTypes.func
}
