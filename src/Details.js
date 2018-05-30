import React from 'react'
import PropTypes from 'prop-types'

function getRenderer(children) {
  return typeof children === 'function'
    ? children
    : () => children
}

export default class Details extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {open: Boolean(props.open)}
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({open: !this.state.open})
  }

  render() {
    const {
      children,
      render = getRenderer(children),
    } = this.props
    const {open} = this.state
    return (
      <details open={open} className='details-reset'>
        {render({open, toggle: this.toggle})}
      </details>
    )
  }
}

Details.propTypes = {
  open: PropTypes.bool,
  render: PropTypes.func
}
