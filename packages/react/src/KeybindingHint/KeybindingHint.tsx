import React, {type ReactNode} from 'react'
import {memo} from 'react'
import Text from '../Text'
import type {KeybindingHintProps} from './props'
import {accessibleSequenceString, Sequence} from './components/Sequence'

/** `kbd` element with style resets. */
const Kbd = ({children}: {children: ReactNode}) => (
  <Text
    as={'kbd' as 'span'}
    sx={{
      color: 'inherit',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      border: 'none',
      background: 'none',
      boxShadow: 'none',
      p: 0,
      lineHeight: 'unset',
      position: 'relative',
      overflow: 'visible',
      verticalAlign: 'baseline',
      textWrap: 'nowrap',
    }}
  >
    {children}
  </Text>
)

// KeybindingHint is a good candidate for memoizing since props will rarely change
/**
 * Indicates the presence of an available keybinding.
 * @primerid keybinding_hint
 * @primerstatus draft
 * @primera11yreviewed false
 */
export const KeybindingHint = memo((props: KeybindingHintProps) => (
  <Kbd>
    <Sequence {...props} />
  </Kbd>
))
KeybindingHint.displayName = 'KeybindingHint'

/**
 * AVOID: `KeybindingHint` is nearly always sufficient for providing both visible and accessible keyboard hints, and
 * will result in a good screen reader experience when used as the target for `aria-describedby` and `aria-labelledby`.
 * However, there may be cases where we need a plain string version, such as when building `aria-label` or
 * `aria-description`. In that case, this plain string builder can be used instead.
 *
 * NOTE that this string should _only_ be used when building `aria-label` or `aria-description` props (never rendered
 * visibly) and should nearly always also be paired with a visible hint for sighted users.
 */
export const getAccessibleKeybindingHintString = accessibleSequenceString
