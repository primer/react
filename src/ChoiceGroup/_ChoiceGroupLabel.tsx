import React from 'react'
import {Box} from '..'
import VisuallyHidden from '../_VisuallyHidden'
import {ChoiceGroupContext} from './ChoiceGroup'
import {Slot} from './slots'

export interface ChoiceGroupLabelProps {
  /**
   * Whether to visually hide the fieldset legend
   */
  visuallyHidden?: boolean
}

const ChoiceGroupLabel: React.FC<ChoiceGroupLabelProps> = ({children, visuallyHidden}) => (
  <Slot name="Label">
    {({required, disabled}: ChoiceGroupContext) => (
      <VisuallyHidden
        isVisible={!visuallyHidden}
        title={required ? 'required field' : undefined}
        sx={{
          display: 'block',
          color: disabled ? 'fg.muted' : undefined,
          fontSize: 2
        }}
      >
        {required ? (
          <Box display="flex" as="span">
            <Box mr={1}>{children}</Box>
            <span>*</span>
          </Box>
        ) : (
          children
        )}
      </VisuallyHidden>
    )}
  </Slot>
)

export default ChoiceGroupLabel
