import React from 'react'

export const ArrowComponent = ({alpha, beta = 'default'}: {alpha: number; beta?: string}) => {
  return (
    <span>
      {alpha}
      {beta}
    </span>
  )
}
