import React from 'react'
import { NavLink } from 'react-router-dom'

const Navigation = ({ title, examples }) => (
  <nav className='menu'>
    <NavLink to={'/'} className='menu-heading no-underline link-gray-dark'>{title}</NavLink>
    {examples.map(example => (
        <NavLink className='menu-item no-underline link-gray-dark' activeClassName='selected' to={'/' + example.name}>
          {example.name}
        </NavLink>
    ))}
  </nav>
)

export default Navigation
