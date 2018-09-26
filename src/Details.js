import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {withSystemProps, COMMON, withoutPropTypes} from './system-props'

const DetailsReset = styled('details')`
  & > summary {
    list-style: none;
  }
  & > summary::before {
    display: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }
`

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
    const {children, render = getRenderer(children), ...rest} = this.props
    const {open} = this.state

    return (
      <DetailsReset {...rest} open={open}>
        {render({open, toggle: this.toggle})}
      </DetailsReset>
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
