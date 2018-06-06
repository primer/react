import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

function getRenderer(children) {
  return typeof children === 'function'
    ? children
    : () => children
}

export default class Toggle extends React.PureComponent {
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
    const {
      children,
      render = getRenderer(children),
    } = this.props
    const {open} = this.state
    return (
      <div>
        {render({open, toggle: this.toggle})}
      </div>
    )
  }
}

Toggle.propTypes = {
  open: PropTypes.bool,
  render: PropTypes.func
}
