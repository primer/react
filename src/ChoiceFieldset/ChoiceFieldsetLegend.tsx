import React from 'react'
import {Box} from '..'
import {ChoiceFieldsetContext, Slot} from './ChoiceFieldset'

export interface ChoiceFieldsetLegendProps {
  visuallyHidden?: boolean
}

const ChoiceFieldsetLegend: React.FC<ChoiceFieldsetLegendProps> = ({children, visuallyHidden}) => (
  <Slot name="Legend">
    {({required}: ChoiceFieldsetContext) => (
      <Box
        as="legend"
        fontSize={2}
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
        mb={3}
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
    )}
  </Slot>
)

export default ChoiceFieldsetLegend
