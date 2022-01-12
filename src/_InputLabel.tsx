import React from 'react'
import {Box} from '.'
import VisuallyHidden from './_VisuallyHidden'

interface Props extends React.HTMLProps<HTMLLabelElement> {
  disabled?: boolean
  required?: boolean
  visuallyHidden?: boolean
}

const InputLabel: React.FC<Props> = ({children, disabled, required, visuallyHidden, htmlFor}) => {
  return (
    <VisuallyHidden
      isVisible={!visuallyHidden}
      as="label"
      htmlFor={htmlFor}
      title={required ? 'required field' : undefined}
      sx={{
        fontWeight: 'bold',
        fontSize: 1,
        display: 'block',
        color: disabled ? 'fg.muted' : 'fg.default',
        cursor: 'pointer'
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
