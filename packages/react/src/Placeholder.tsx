import type React from 'react'
import classes from './Placeholder.module.css'

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
    <div
      id={id}
      className={classes.Placeholder}
      style={
        {
          '--placeholder-width': typeof width === 'number' ? `${width}px` : width,
          '--placeholder-height': typeof height === 'number' ? `${height}px` : height,
        } as React.CSSProperties
      }
    >
      {label}
    </div>
  )
}
