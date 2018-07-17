import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Details from './Details'
import Button from './Button'
import Caret from './Caret'
import {mapWhitespaceProps} from './props'

const arrowStyles = {
  content: '',
  border: '4px solid',
  borderRightColor: 'transparent',
  borderLeftColor: 'transparent',
  borderBottomColor: 'transparent',
  width: '0',
  height: '0'
}

export default function Dropdown(props) {
  const {title, scheme, children, className} = mapWhitespaceProps(props)
  return (
    <div className={classnames(className, 'BtnGroup')}>
      <Details className="details-reset BtnGroup-form d-flex">
        {({toggle}) => (
          <React.Fragment>
            <Button tag="summary" scheme={scheme} grouped onClick={toggle}>
              {title} <div className="d-inline-block v-align-middle" style={arrowStyles} />
            </Button>
            <div
              className="border box-shadow position-absolute px-3 py-2 bg-white mt-1 rounded-1 list-style-none"
              style={{zIndex: 99999}}
            >
              <div className="position-absolute ml-0 mt-n2">
                <Caret edge="top" align="start" />
              </div>
              {children}
            </div>
          </React.Fragment>
        )}
      </Details>
    </div>
  )
}

Dropdown.propTypes = {
  children: PropTypes.node,
  scheme: Button.propTypes.scheme,
  title: PropTypes.string
}
