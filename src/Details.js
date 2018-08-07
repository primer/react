import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {withSystemProps, COMMON, withoutPropTypes} from './system-props'

class Details extends React.Component {
  constructor(props) {
    super(props)
    this.state = {open: Boolean(props.open)}
    this.toggle = this.toggle.bind(this)
  }

  toggle(event) {
    if (event) {
      event.preventDefault()
    }
    this.setState({open: !this.state.open})
  }

  render() {
    const {className, children, render = getRenderer(children), ...rest} = this.props
    // XXX this guards against "double renders" in system-components
    if (rest.is) {
      console.warn(`<Details is={${rest.is}}>`)
      delete rest.is
    }
    const {open} = this.state

    return (
      <details {...rest} className={classnames('details-reset', className)} open={open}>
        {render({open, toggle: this.toggle})}
      </details>
    )
  }
}

function getRenderer(children) {
  return typeof children === 'function' ? children : () => children
}

Details.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  open: PropTypes.bool,
  render: PropTypes.func
}

export default withoutPropTypes(withSystemProps(Details, COMMON), ['is'])
