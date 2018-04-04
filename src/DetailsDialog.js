import React from 'react'
import styled from 'styled-components'
import XOcticon from '@github/octicons-react/build/icons/x'
import 'details-dialog-element'

const DetailsDialog = ({title, children, className='', ...rest}) => (
  /* TODO: how to assign ids for title and description? */
  <details-dialog className={`Overlay ${className}`} {...rest}>
    <div className='Overlay-table-full'>
      <div className='Overlay-cell-middle'>
        <div className='Box Box--overlay'>
          <div className='Box-header clearfix'>
            <button type='button' className='Box-btn-octicon btn-octicon float-right'
              data-close-dialog>
              <XOcticon aria-label='Close'/>
            </button>
            <h3 className='Box-title overflow-hidden pr-3' id='test-box-overlay-title-1'>
              {title}
            </h3>
          </div>
          <div className='Box-body'>
            {children}
          </div>
        </div>
      </div>
    </div>
  </details-dialog>
)

export default styled(DetailsDialog)`
  position: fixed;
  margin: 10vh auto;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  max-height: 80vh;
  width: 448px;
`
