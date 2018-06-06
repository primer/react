import React from 'react'
import classnames from 'classnames'
import Details from './Details'
import Button from './Button'

const Dropdown = ({children}) => (
  <div className='BtnGroup'>
    <Details className='details-reset BtnGroup-form d-flex'>
      {({open, toggle}) => (
        <React.Fragment>
          <Button is='summary' scheme='primary' grouped onClick={toggle}>{open ? '▲' : '▼'}</Button>
          <div className='border box-shadow position-absolute px-3 py-2'>
            {children}
          </div>
        </React.Fragment>
      )}
    </Details>
  </div>
)

export default Dropdown
