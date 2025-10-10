import React from 'react'
import VisuallyHidden from '../../../_VisuallyHidden'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'
import classes from './CheckboxOrRadioGroup.module.css'
import {Stack} from '../../../Stack'
import {clsx} from 'clsx'

export type CheckboxOrRadioGroupLabelProps = {
  /** Class name for custom styling */
  className?: string
  /**
   * Whether to visually hide the fieldset legend
   */
  visuallyHidden?: boolean
}

const CheckboxOrRadioGroupLabel: React.FC<React.PropsWithChildren<CheckboxOrRadioGroupLabelProps>> = ({
  children,
  className,
  visuallyHidden = false,
}) => {
  const {required, disabled} = React.useContext(CheckboxOrRadioGroupContext)

  return (
    <VisuallyHidden
      className={clsx(className, classes.RadioGroupLabel)}
      isVisible={!visuallyHidden}
      title={required ? 'required field' : undefined}
      data-label-disabled={disabled ? '' : undefined}
    >
      {required ? (
        <Stack direction="horizontal" gap="none">
          <div className={classes.GroupLabelChildren}>{children}</div>
          <span>*</span>
        </Stack>
      ) : (
        children
      )}
    </VisuallyHidden>
  )
}

export default CheckboxOrRadioGroupLabel
