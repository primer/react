import React, {type ReactNode} from 'react'
import {memo} from 'react'
import Text from '../Text'
import type {KeybindingHintProps} from './props'
import {accessibleSequenceString, Sequence} from './components/Sequence'
import {useFeatureFlag} from '../FeatureFlags'

import classes from './KeybindingHint.module.css'
import {clsx} from 'clsx'

/** `kbd` element with style resets. */
const Kbd = ({children, className}: {children: ReactNode; className?: string}) => {
  const enabled = useFeatureFlag('primer_react_css_modules_ga')

  return (
    <Text
      as={'kbd' as 'span'}
      className={clsx(className, enabled && classes.KeybindingHint)}
      data-testid="keybinding-hint"
      sx={
        enabled
          ? undefined
          : {
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
            }
      }
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
