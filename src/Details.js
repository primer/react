import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class Details extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {open: this.props.open}
    this.toggle = this.toggle.bind(this)
  }

  toggle(event) {
    event.preventDefault()
    this.setState({open: !this.state.open})
  }

  render() {
    const {className, children, ...props} = this.props
    const {open} = this.state
    const renderProps = {open, toggle: this.toggle}
    return (
      <details {...props} className={className || 'details-reset'} open={open}>
        {typeof children === 'function' ? children(renderProps) : children}
      </details>
    )
  }
}

export default Details
