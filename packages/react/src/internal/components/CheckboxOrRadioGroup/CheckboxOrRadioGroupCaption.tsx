import React from 'react'
import Text from '../../../Text'
import type {SxProp} from '../../../sx'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'
import classes from './CheckboxOrRadioGroup.module.css'
import {clsx} from 'clsx'

type CheckboxOrRadioGroupCaptionProps = React.PropsWithChildren<SxProp> & {className?: string}

const CheckboxOrRadioGroupCaption: React.FC<CheckboxOrRadioGroupCaptionProps> = ({className, children, sx}) => {
  const {captionId} = React.useContext(CheckboxOrRadioGroupContext)
  return (
    <Text className={clsx(className, classes.CheckboxOrRadioGroupCaption)} id={captionId} sx={sx}>
      {children}
    </Text>
  )
}

export default CheckboxOrRadioGroupCaption
