import React from 'react'

export default class Dropdown extends React.Component {
  constructor({open=false, direction, ...props}) {
    super(props)
    this.state = {open, direction}
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    return this.setState({open: !this.state.open})
  }

  render() {
    const {className='', children, ...rest} = this.props
    const items = React.Children.toArray(children)
    // FIXME: just take the first child?
    const summary = items.splice(0, 1)
    const {open, direction='se'} = this.state
    return (
      <details className={`details-reset position-relative ${className}`} open={open} {...rest}>
        <summary onClick={this.toggle}>{summary}</summary>
        <ul className={`dropdown-menu text-left ${direction ? 'dropdown-menu-' + direction : ''}`}>
          {items}
        </ul>
      </details>
    )
  }
}

function DropdownButton({className='', children, ...rest}) {
  const klass = className.includes('btn-link') ? className : `btn ${className}`
  return (
    <button className={`${klass} dropdown-toggle`}
      {...rest}>
      {children}{' '}<div className='dropdown-caret'/>
    </button>
  )
}

function DropdownItem({children, ...rest}) {
  return (
    <li>
      <a className='dropdown-item' {...rest}>
        {children}
      </a>
    </li>
  )
}

Dropdown.Item = DropdownItem
Dropdown.Button = DropdownButton
