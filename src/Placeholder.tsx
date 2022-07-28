import {Box} from '.'
import React from 'react'

/** Private component used to render placeholders in storybook and documentation examples  */
export const Placeholder: React.FC<
  React.PropsWithChildren<{
    width?: number | string
    height: number | string
    label?: string
  }>
> = ({width, height, label}) => {
  return (
    <Box
      sx={{
        width: width ?? '100%',
        height,
        display: 'grid',
        placeItems: 'center',
        bg: 'canvas.inset',
        borderRadius: 2
      }}
    >
      {label}
    </Box>
  )
}
