import React from 'react'
import {Box} from '..'
import {SxProp} from '../sx'
import VisuallyHidden from '../_VisuallyHidden'
import {ChoiceGroupContext} from './ChoiceGroup'
import {Slot} from './slots'

export type ChoiceGroupLabelProps = {
  /**
   * Whether to visually hide the fieldset legend
   */
  visuallyHidden?: boolean
} & SxProp

const ChoiceGroupLabel: React.FC<ChoiceGroupLabelProps> = ({children, visuallyHidden, sx}) => (
  <Slot name="Label">
    {({required, disabled}: ChoiceGroupContext) => (
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

ChoiceGroupLabel.defaultProps = {
  visuallyHidden: false
}

export default ChoiceGroupLabel
