import React from 'react'
import PropTypes from 'prop-types'

function getRenderer(children) {
  return typeof children === 'function' ? children : () => children
}

export default class Details extends React.Component {
  constructor(props) {
    super(props)
    this.state = {open: Boolean(props.open)}
    this.toggle = this.toggle.bind(this)
  }

  toggle(event) {
    if (event) {
      event.preventDefault()
    }
    this.setState({ open: !this.state.open })
  }

  render() {
    const {
      className,
      children,
      render = getRenderer(children),
      ...props
    } = this.props
    const { open } = this.state

    return (
      <details {...props} className={classnames('details-reset', className)} open={open}>
        {render({open, toggle: this.toggle})}
      </details>
    )
  }
}

Details.propTypes = {
  open: PropTypes.bool,
  render: PropTypes.func
}
