import {type ReactNode} from 'react'
import {memo} from 'react'
import Text from '../Text'
import type {KeybindingHintProps} from './props'
import {Sequence} from './components/Sequence'

import classes from './KeybindingHint.module.css'
import {clsx} from 'clsx'

/** `kbd` element with style resets. */
const Kbd = ({children, className}: {children: ReactNode; className?: string}) => {
  return (
    <Text
      as={'kbd' as 'span'}
      className={clsx(className, classes.KeybindingHint)}
      data-testid="keybinding-hint"
      data-component="KeybindingHint"
    >
      {children}
    </Text>
  )
}

/** Indicates the presence of an available keybinding. */
// KeybindingHint is a good candidate for memoizing since props will rarely change
export const KeybindingHint = memo(({className, ...props}: KeybindingHintProps) => (
  <Kbd className={className}>
    <Sequence {...props} />
  </Kbd>
))
KeybindingHint.displayName = 'KeybindingHint'
