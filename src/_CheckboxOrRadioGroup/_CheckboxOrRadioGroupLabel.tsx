import React from 'react'
import {Box} from '..'
import {SxProp} from '../sx'
import VisuallyHidden from '../_VisuallyHidden'
import {CheckboxOrRadioGroupContext} from './CheckboxOrRadioGroup'
import {Slot} from './slots'

export type CheckboxOrRadioGroupLabelProps = {
  /**
   * Whether to visually hide the fieldset legend
   */
  visuallyHidden?: boolean
} & SxProp

const CheckboxOrRadioGroupLabel: React.FC<CheckboxOrRadioGroupLabelProps> = ({children, visuallyHidden, sx}) => (
  <Slot name="Label">
    {({required, disabled}: CheckboxOrRadioGroupContext) => (
      <VisuallyHidden
        isVisible={!visuallyHidden}
        title={required ? 'required field' : undefined}
        sx={{
          display: 'block',
          color: disabled ? 'fg.muted' : undefined,
          fontSize: 2,
          ...sx
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

CheckboxOrRadioGroupLabel.defaultProps = {
  visuallyHidden: false
}

export default CheckboxOrRadioGroupLabel
