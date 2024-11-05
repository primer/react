import {clsx} from 'clsx'
import React from 'react'
import Text from '../../Text'
import type {SxProp} from '../../sx'
import classes from './InputCaption.module.css'
import {useFeatureFlag} from '../../FeatureFlags'

type Props = {
  /**
   * The unique identifier used to associate the caption with an input
   */
  id: string

  /**
   * Whether the input associated with this caption is disabled
   */
  disabled?: boolean

  /**
   * Provide an optional class name applied to the outermost element
   */
  className?: string
} & SxProp

const InputCaption: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className: customClassName,
  disabled,
  id,
  sx,
}) => {
  const enabled = useFeatureFlag('primer_react_css_modules_team')
  const className = clsx(customClassName, {
    [classes.InputCaption]: enabled,
  })

  if (enabled) {
    if (sx) {
      return (
        <Text id={id} data-disabled={disabled ? '' : undefined} className={className} sx={sx}>
          {children}
        </Text>
      )
    }
    return (
      <Text id={id} data-disabled={disabled ? '' : undefined} className={className}>
        {children}
      </Text>
    )
  }

  return (
    <Text
      id={id}
      className={className}
      sx={{
        color: disabled ? 'var(--control-fgColor-disabled)' : 'var(--fgColor-muted)',
        display: 'block',
        fontSize: 0,
        ...sx,
      }}
    >
      {children}
    </Text>
  )
}

export default InputCaption
