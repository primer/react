import React from 'react'
import Box from '../../../Box'
import VisuallyHidden from '../../../_VisuallyHidden'
import type {SxProp} from '../../../sx'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'
import {CSS_MODULES_FLAG} from './FeatureFlag'
import {useFeatureFlag} from '../../../FeatureFlags'
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
} & SxProp

const CheckboxOrRadioGroupLabel: React.FC<React.PropsWithChildren<CheckboxOrRadioGroupLabelProps>> = ({
  children,
  className,
  visuallyHidden = false,
  sx,
}) => {
  const {required, disabled} = React.useContext(CheckboxOrRadioGroupContext)
  const enabled = useFeatureFlag(CSS_MODULES_FLAG)

  if (enabled) {
    if (sx) {
      return (
        <VisuallyHidden
          className={clsx(className, classes.RadioGroupLabel)}
          isVisible={!visuallyHidden}
          title={required ? 'required field' : undefined}
          data-label-disabled={disabled ? '' : undefined}
          sx={sx}
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

  return (
    <VisuallyHidden
      className={className}
      isVisible={!visuallyHidden}
      title={required ? 'required field' : undefined}
      sx={{
        display: 'block',
        color: disabled ? 'fg.muted' : undefined,
        fontSize: 1,
        fontWeight: 'bold',
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
