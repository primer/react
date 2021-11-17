import React from 'react'
import {Box} from '.'

interface Props extends React.HTMLProps<HTMLLabelElement> {
  disabled?: boolean
  required?: boolean
  visuallyHidden?: boolean
}

const InputLabel: React.FC<Props> = ({children, disabled, required, visuallyHidden, ...rest}) => {
  return (
    // TODO: fix typescript errors
    <Box
      fontWeight="bold"
      fontSize={1}
      as="label"
      display="block"
      color={disabled ? 'fg.muted' : 'fg.default'}
      title={required ? 'required field' : undefined}
      sx={
        // TODO: create a VisuallyHidden component if this hiding technique is used in any other components
        visuallyHidden
          ? {
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: '0',
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              borderWidth: '0'
            }
          : undefined
      }
      {...rest}
    >
      {required ? (
        <Box display="flex" as="span">
          <Box mr={1}>{children}</Box>
          <span>*</span>
        </Box>
      ) : (
        children
      )}
    </Box>
  )
}

export default InputLabel
