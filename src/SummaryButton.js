import React from 'react'
import Button from './Button'

const SummaryButton = props => (
  <Button {...props} tag='summary' type={null} />
)

SummaryButton.propTypes = {...Button.propTypes}
// <summary> does not have a type attribute
delete SummaryButton.propTypes.type

export default SummaryButton
