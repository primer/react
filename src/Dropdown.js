import React from 'react'
import classnames from 'classnames'
import Details from './Details'
import Button from './Button'

const Dropdown = ({ title, scheme, children}) => (
  <div className='BtnGroup'>
    <Details className='details-reset BtnGroup-form d-flex'>
      {({open, toggle}) => (
        <React.Fragment>
          <Button tag='summary' scheme={scheme} grouped onClick={toggle}>{title} ▼</Button>
          <div className='border box-shadow position-absolute px-3 py-2 bg-white' style={{zIndex: 1}}>
            {children}
          </div>
        </React.Fragment>
      )}
    </Details>
  </div>
)

export default Dropdown
