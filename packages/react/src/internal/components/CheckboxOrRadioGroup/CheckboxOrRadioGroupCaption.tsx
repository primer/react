import React from 'react'
import Text from '../../../Text'
import type {SxProp} from '../../../sx'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'
import classes from './CheckboxOrRadioGroup.module.css'
import {CSS_MODULES_FLAG} from './FeatureFlag'
import {useFeatureFlag} from '../../../FeatureFlags'
import {clsx} from 'clsx'

type CheckboxOrRadioGroupCaptionProps = React.PropsWithChildren<SxProp> & {className?: string}

const CheckboxOrRadioGroupCaption: React.FC<CheckboxOrRadioGroupCaptionProps> = ({className, children, sx}) => {
  const {disabled, captionId} = React.useContext(CheckboxOrRadioGroupContext)
  const enabled = useFeatureFlag(CSS_MODULES_FLAG)
  if (enabled) {
    if (sx) {
      return (
        <Text className={clsx(className, classes.CheckboxOrRadioGroupCaption)} id={captionId} sx={sx}>
          {children}
        </Text>
      )
    }
    return (
      <span className={clsx(className, classes.CheckboxOrRadioGroupCaption)} id={captionId}>
        {children}
      </span>
    )
  }

  return (
    <Text color={disabled ? 'fg.muted' : 'fg.subtle'} fontSize={1} id={captionId} sx={sx} className={className}>
      {children}
    </Text>
  )
}

export default CheckboxOrRadioGroupCaption
