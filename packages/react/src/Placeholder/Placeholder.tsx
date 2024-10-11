import Box from '../Box'
import React from 'react'

import styles from './Placeholder.module.css'

/** Private component used to render placeholders in storybook and documentation examples  */
export const Placeholder: React.FC<
  React.PropsWithChildren<{
    id?: string | undefined
    width?: number | string
    height: number | string
    label?: string
  }>
> = ({width, height, id, label}) => {
  return (
    <Box id={id} className={styles.Box_0} style={{width: width ?? '100%', height}}>
      {label}
    </Box>
  )
}
