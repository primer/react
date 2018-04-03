import React from 'react'
import {splice} from './lib/utils'

const Dropdown = ({children, direction='se', ...rest}) => {
  const items = React.Children.toArray(children)
  const buttons = splice(items, child => child.type === DropdownButton)
  return (
    <div className='dropdown js-menu-container js-select-menu' {...rest}>
      {buttons}
      <div className='dropdown-menu-content js-menu-content'>
        <ul className={`dropdown-menu text-left ${direction ? 'dropdown-menu-' + direction : ''}`}>
          {items}
        </ul>
      </div>
    </div>
  )
}

function DropdownButton({className='', children, ...rest}) {
  const klass = className.includes('btn-link') ? className : `btn ${className}`
  return (
    <button className={`${klass} dropdown-toggle js-menu-target`}
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

export default Dropdown
export {DropdownButton, DropdownItem}
