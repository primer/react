import type React from 'react'
import type {PolymorphicProps} from '../utils/types/component'

export type TokenElement = 'span' | 'a' | 'button' | Exclude<React.ElementType, keyof React.JSX.IntrinsicElements>

export type TokenRoot<As extends TokenElement> = React.ComponentRef<As> | HTMLSpanElement

// React's bivariant Ref type otherwise accepts anchor-only refs for a span shell.
export type CompatibleRootRef<Root, Ref> =
  Ref extends React.RefObject<infer Element>
    ? [Root] extends [NonNullable<Element>]
      ? Ref
      : never
    : Ref extends (element: infer Element) => unknown
      ? [Root] extends [NonNullable<Element>]
        ? Ref
        : never
      : Ref

export type CompoundTokenProps<As extends TokenElement, Props, Ref extends React.Ref<TokenRoot<As>>> = PolymorphicProps<
  As,
  Omit<Props, 'as'> & {
    /** Root ref, including the span shell used by visibly removable actions. */
    ref?: Ref & CompatibleRootRef<TokenRoot<As>, Ref>
  },
  'span'
>

export type CompoundTokenRef<As extends TokenElement> = React.Ref<TokenRoot<As>>

type NativeTokenAttributes = Omit<
  React.ComponentPropsWithRef<'a'>,
  keyof React.HTMLAttributes<HTMLElement> | 'key' | 'ref'
> &
  Omit<
    React.ComponentPropsWithRef<'button'>,
    keyof React.HTMLAttributes<HTMLElement> | keyof React.ComponentPropsWithRef<'a'> | 'key' | 'ref'
  >

export type SpanTokenActionExclusions<Props> = Partial<Record<Exclude<keyof NativeTokenAttributes, keyof Props>, never>>

export type OptionalCompoundTokenProps<As extends TokenElement, Props, Ref extends CompoundTokenRef<As>> = Props &
  Omit<CompoundTokenProps<As, Props, Ref>, 'as'> & {as: As | undefined} & SpanTokenActionExclusions<Props> &
  (TokenElement extends As ? never : unknown)

export type DefaultCompoundTokenProps<Props> = Omit<
  CompoundTokenProps<'span', Props, CompoundTokenRef<'span'>>,
  'as' | 'ref'
> &
  Omit<NativeTokenAttributes, keyof Props> & {
    /**
     * Element to render. Use `a` or `button` when the token is interactive.
     * @default 'span'
     */
    as?: TokenElement
    /** Root ref, including the span shell used by visibly removable actions. */
    ref?: React.Ref<HTMLElement>
  }

export type BroadCompoundTokenProps<Props, Inferred extends DefaultCompoundTokenProps<Props>> = Inferred &
  ('as' extends keyof Inferred
    ? 'span' | 'a' | 'button' extends NonNullable<Inferred['as']>
      ? unknown
      : never
    : never) &
  ([Inferred['ref']] extends [CompatibleRootRef<HTMLElement, Inferred['ref']>] ? unknown : never)

const anchorAttributes = ['download', 'hrefLang', 'media', 'ping', 'referrerPolicy', 'rel', 'target'] as const
const buttonAttributes = [
  'form',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',
  'name',
  'value',
  'popoverTarget',
  'popoverTargetAction',
] as const
const globalAttributes: readonly string[] = [
  'defaultChecked',
  'defaultValue',
  'suppressContentEditableWarning',
  'suppressHydrationWarning',
  'accessKey',
  'autoCapitalize',
  'autoFocus',
  'className',
  'contentEditable',
  'contextMenu',
  'dir',
  'draggable',
  'enterKeyHint',
  'hidden',
  'id',
  'lang',
  'nonce',
  'slot',
  'spellCheck',
  'style',
  'tabIndex',
  'title',
  'translate',
  'radioGroup',
  'role',
  'about',
  'content',
  'datatype',
  'inlist',
  'prefix',
  'property',
  'resource',
  'rev',
  'typeof',
  'vocab',
  'autoCorrect',
  'autoSave',
  'color',
  'itemProp',
  'itemScope',
  'itemType',
  'itemID',
  'itemRef',
  'results',
  'security',
  'unselectable',
  'popover',
  'inert',
  'inputMode',
  'is',
  'exportparts',
  'part',
] satisfies readonly (keyof React.HTMLAttributes<HTMLElement>)[]

/**
 * The shell retains global DOM props. Native action attributes and custom-root
 * props belong to the inner action when a removable token needs sibling targets.
 */
export function splitTokenProps<Props extends React.HTMLAttributes<HTMLElement>>(
  props: Props,
  as: React.ElementType | undefined,
  split: boolean,
) {
  const rootProps: Record<string, unknown> = {}
  const actionProps: Record<string, unknown> = {}

  const custom = as !== undefined && typeof as !== 'string'
  for (const [key, value] of Object.entries(props)) {
    const nativeActionAttribute =
      (as === 'a' && anchorAttributes.some(attribute => attribute === key)) ||
      (as === 'button' && buttonAttributes.some(attribute => attribute === key))
    const customAttribute =
      custom &&
      !key.startsWith('aria-') &&
      !key.startsWith('data-') &&
      !/^on[A-Z]/.test(key) &&
      !globalAttributes.includes(key)

    if (split && (nativeActionAttribute || customAttribute)) {
      actionProps[key] = value
    } else {
      rootProps[key] = value
    }
  }
  return {rootProps, actionProps}
}
