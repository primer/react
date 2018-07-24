import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {mapWhitespaceProps} from './props'

function getRenderer(children) {
  return typeof children === 'function' ? children : () => children
}

export default class Details extends React.Component {
  constructor(props) {
    super(props)
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.toggle = this.toggle.bind(this)
    this.state = {open: Boolean(props.open)}
  }


  toggle(event) {
    if (event) {
      event.preventDefault()
    }
    if (!this.state.open) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
       open: !prevState.open,
    }));
  }

  handleOutsideClick(e) {
    if (this.details.contains(e.target)) {
      return;
    }
    this.toggle();
  }

  render() {
    const {className, children, render = getRenderer(children), ...rest} = mapWhitespaceProps(this.props)
    const {open} = this.state

    return (
      <details ref={node => { this.details = node; }} {...rest} className={classnames('details-reset d-inline', className)} open={open}>
        {render({open, toggle: this.toggle})}
      </details>
    )
  }
}

Details.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  open: PropTypes.bool,
  render: PropTypes.func
}
