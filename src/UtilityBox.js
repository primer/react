// This component is built using the system-classnames, this allows you to apply
// Primer utilities to UtilityBox. You can any utilities included in the utility map:
// https://github.com/jxnblk/styled-system/blob/master/system-classnames/src/primer.js.
// Or to add new utilities with different namespaces, create your own mapper module.

// Example: `<UtilityBox p={[ 2, 3 ]} bg='green-light' />`
// Renders as: `<div class="p-2 p-sm-3 bg-green-light">`

import React from 'react'
import map from 'system-classnames/primer'

const UtilityBox = props => (
  <div {...map(props)}/>
)

export default UtilityBox
