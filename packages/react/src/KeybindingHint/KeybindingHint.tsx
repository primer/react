import {type ReactNode} from 'react'
import {memo} from 'react'
import Text from '../Text'
import type {KeybindingHintProps} from './props'
import {accessibleSequenceString, Sequence} from './components/Sequence'

import classes from './KeybindingHint.module.css'
import {clsx} from 'clsx'

/** `kbd` element with style resets. */
const Kbd = ({children, className}: {children: ReactNode; className?: string}) => {
  return (
    <Text as={'kbd' as 'span'} className={clsx(className, classes.KeybindingHint)} data-testid="keybinding-hint">
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

/**
 * AVOID: `KeybindingHint` is nearly always sufficient for providing both visible and accessible keyboard hints.
 * However, there may be cases where we need a plain string version, such as when building `aria-label` or
 * `aria-description`. In that case, this plain string builder can be used instead.
 *
 * NOTE that this string should _only_ be used when building `aria-label` or `aria-description` props (never rendered
 * visibly) and should nearly always also be paired with a visible hint for sighted users.
 */
export const getAccessibleKeybindingHintString = accessibleSequenceString
