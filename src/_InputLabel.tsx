import React from 'react'
import {Box} from '.'
import {SxProp} from './sx'
import VisuallyHidden from './_VisuallyHidden'

type BaseProps = SxProp & {
  disabled?: boolean
  required?: boolean
  visuallyHidden?: boolean
  id?: string
}

type LabelProps = BaseProps & {
  htmlFor?: string
  as?: 'label'
}

type LegendProps = BaseProps & {
  as: 'legend'
  htmlFor?: undefined
}

type Props = LabelProps | LegendProps

const InputLabel: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  disabled,
  htmlFor,
  id,
  required,
  visuallyHidden,
  sx,
  as = 'label'
}) => {
  return (
    <VisuallyHidden
      isVisible={!visuallyHidden}
      as={
        as as 'label' /* This assertion is clearly wrong, but it's the only way TS will allow the htmlFor prop to be possibly defined */
      }
      htmlFor={htmlFor}
      id={id}
      sx={{
        fontWeight: 'bold',
        fontSize: 1,
        display: 'block',
        color: disabled ? 'fg.muted' : 'fg.default',
        cursor: disabled ? 'default' : 'pointer',
        alignSelf: 'flex-start',
        ...sx
      }}
    >
      {required ? (
        <Box display="flex" as="span">
          <Box mr={1}>{children}</Box>
          <span aria-hidden="true">*</span>
        </Box>
      ) : (
        children
      )}
    </VisuallyHidden>
  )
}

export default InputLabel
