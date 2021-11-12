import React from 'react'
import {Box, Text} from '.'

interface Props extends React.HTMLAttributes<HTMLLabelElement> {
  visuallyHidden?: boolean
  required?: boolean
}

const InputLabel: React.FC<Props> = ({children, required, visuallyHidden, ...rest}) => {
  return (
    <Text
      fontWeight="bold"
      fontSize={1}
      as="label"
      display="block"
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
    </Text>
  )
}

export default InputLabel
