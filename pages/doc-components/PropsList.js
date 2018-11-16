import React from 'react'
import PropTypes from 'prop-types'

const PropsList = ({systemProps}) => <div>{systemProps.join(', ')}</div>

PropsList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.string)
}

export default PropsList
