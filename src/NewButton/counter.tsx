import React from 'react'
import Box from '../Box'

type CounterProps = {
  count: number
}

const styles = {
  display: 'inline-block',
  padding: '0px 6px',
  backgroundColor: 'neutral.muted',
  borderRadius: '50%',
  marginLeft: '8px',
  marginRight: '-4px'
}

const Counter = ({count}: CounterProps) => {
  // get this to announce new count. How? Change aria property for every render? or aria-live?
  return <Box sx={styles}>{count}</Box>
}

export default Counter
