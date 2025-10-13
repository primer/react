import React from 'react'
import Text from '../../../Text'
import CheckboxOrRadioGroupContext from './CheckboxOrRadioGroupContext'
import classes from './CheckboxOrRadioGroup.module.css'
import {clsx} from 'clsx'
import type {FCWithSlotMarker} from '../../../utils/types'

type CheckboxOrRadioGroupCaptionProps = React.PropsWithChildren<{className?: string}>

const CheckboxOrRadioGroupCaption: FCWithSlotMarker<CheckboxOrRadioGroupCaptionProps> = ({className, children}) => {
  const {captionId} = React.useContext(CheckboxOrRadioGroupContext)
  return (
    <Text className={clsx(className, classes.CheckboxOrRadioGroupCaption)} id={captionId}>
      {children}
    </Text>
  )
}

export default CheckboxOrRadioGroupCaption

CheckboxOrRadioGroupCaption.__SLOT__ = Symbol('CheckboxOrRadioGroupCaption')
