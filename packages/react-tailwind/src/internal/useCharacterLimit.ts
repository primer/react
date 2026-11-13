'use client'

import React from 'react'
import {getCharacterCountState} from '../utils/characterCounter'

interface UseCharacterLimitOptions {
  characterLimit?: number
  defaultValue?: React.InputHTMLAttributes<HTMLInputElement>['defaultValue']
  value?: React.InputHTMLAttributes<HTMLInputElement>['value']
}

/** Tracks the current length of a native text control and derives its character-limit state during render. */
export function useCharacterLimit({characterLimit, defaultValue, value}: UseCharacterLimitOptions) {
  const characterLimitId = React.useId()
  const [uncontrolledLength, setUncontrolledLength] = React.useState(() =>
    defaultValue === undefined ? 0 : String(defaultValue).length,
  )
  const currentLength = value === undefined ? uncontrolledLength : String(value).length
  const counter = characterLimit === undefined ? undefined : getCharacterCountState(currentLength, characterLimit)

  return {
    characterLimitId: counter ? characterLimitId : undefined,
    counter,
    onValueChange(nextValue: string) {
      if (characterLimit !== undefined && value === undefined) setUncontrolledLength(nextValue.length)
    },
  }
}
