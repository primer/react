import React from 'react'
import PropTypes from 'prop-types'
import Details from './Details'

const Dropdown  = ({ title, children }) => (
  <Details btnStyle>{({open, toggle}) => (
    <React.Fragment>
      <summary onClick={toggle}>{title || "▼"}</summary>
        {children}
    </React.Fragment>
  )}
  </Details>
);

export default Dropdown
