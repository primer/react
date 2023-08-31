import React from 'react'
import Box from '../../../Box'
import VisuallyHidden from '../../../_VisuallyHidden'
import {SxProp} from '../../../sx'
import {CheckboxOrRadioGroupContext} from './CheckboxOrRadioGroup'

export type CheckboxOrRadioGroupLabelProps = {
  /**
   * Whether to visually hide the fieldset legend
   */
  visuallyHidden?: boolean
} & SxProp

const CheckboxOrRadioGroupLabel: React.FC<React.PropsWithChildren<CheckboxOrRadioGroupLabelProps>> = ({
  children,
  visuallyHidden = false,
  sx,
}) => {
  const {required, disabled} = React.useContext(CheckboxOrRadioGroupContext)
  return (
    <VisuallyHidden
      isVisible={!visuallyHidden}
      title={required ? 'required field' : undefined}
      sx={{
        display: 'block',
        color: disabled ? 'fg.muted' : undefined,
        fontSize: 2,
        ...sx,
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
  )
}

export default CheckboxOrRadioGroupLabel
