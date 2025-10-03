import {FocusKeys} from '@primer/behaviors'
import {isFocusable} from '@primer/behaviors/utils'
import {omit} from '@styled-system/props'
import type {FocusEventHandler, KeyboardEventHandler, MouseEventHandler, RefObject} from 'react'
import React, {useRef, useState} from 'react'
import {isValidElementType} from 'react-is'
import {useRefObjectAsForwardedRef} from '../hooks/useRefObjectAsForwardedRef'
import {useFocusZone} from '../hooks/useFocusZone'
import Text from '../Text'
import type {TextInputProps} from '../TextInput'
import Token from '../Token/Token'
import type {TokenSizeKeys} from '../Token/TokenBase'

import type {TextInputSizes} from '../internal/components/TextInputWrapper'
import TextInputWrapper from '../internal/components/TextInputWrapper'
import UnstyledTextInput from '../internal/components/UnstyledTextInput'
import TextInputInnerVisualSlot from '../internal/components/TextInputInnerVisualSlot'
import styles from './TextInputWithTokens.module.css'
import {clsx} from 'clsx'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReactComponent = React.ComponentType<React.PropsWithChildren<any>>

// NOTE: if these props or their JSDoc comments are updated, be sure to also update
// the prop table in docs/content/TextInputTokens.mdx
/**
 * @deprecated
 */
export type TextInputWithTokensProps<TokenComponentType extends AnyReactComponent = typeof Token> = {
  /**
   * The array of tokens to render
   */
  tokens: TokenComponentType extends React.ComponentType<React.PropsWithChildren<infer TokenProps>>
    ? TokenProps[]
    : never
  /**
   * The function that gets called when a token is removed
   */
  onTokenRemove: (tokenId: string | number) => void
  /**
   * The component used to render each token
   */
  tokenComponent?: TokenComponentType
  /**
   * The maximum height of the component. If the content in the input exceeds this height,
   * it will scroll vertically
   */
  maxHeight?: React.CSSProperties['maxHeight']
  /**
   * Whether tokens should render inline horizontally. By default, tokens wrap to new lines.
   */
  preventTokenWrapping?: boolean
  /**
   * The size of the tokens and text input
   */
  size?: TokenSizeKeys
  /**
   * Whether the remove buttons should be rendered in the tokens
   */
  hideTokenRemoveButtons?: boolean
  /**
   * The number of tokens to display before truncating
   */
  visibleTokenCount?: number
} & Omit<TextInputProps, 'size'>

const overflowCountClassMap: Record<TokenSizeKeys, string> = {
  small: styles.OverflowCountSmall,
  medium: styles.OverflowCountMedium,
  large: styles.OverflowCountLarge,
  xlarge: styles.OverflowCountXLarge,
}

// using forwardRef is important so that other components (ex. Autocomplete) can use the ref
function TextInputWithTokensInnerComponent<TokenComponentType extends AnyReactComponent>(
  {
    icon: IconComponent,
    leadingVisual: LeadingVisual,
    trailingVisual: TrailingVisual,
    loading,
    loaderPosition = 'auto',
    contrast,
    className,
    block,
    disabled,
    tokens,
    onTokenRemove,
    tokenComponent: TokenComponent = Token,
    preventTokenWrapping = false,
    size = 'xlarge',
    hideTokenRemoveButtons = false,
    maxHeight,
    width: widthProp,
    minWidth: minWidthProp,
    maxWidth: maxWidthProp,
    validationStatus,
    variant: variantProp, // deprecated. use `size` instead
    visibleTokenCount,
    style,
    ...rest
  }: TextInputWithTokensProps<TokenComponentType | typeof Token>,
  forwardedRef: React.ForwardedRef<HTMLInputElement>,
) {
  const {onBlur, onFocus, onKeyDown, ...inputPropsRest} = omit(rest)
  const ref = useRef<HTMLInputElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, ref)
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | undefined>()
  const [tokensAreTruncated, setTokensAreTruncated] = useState<boolean>(Boolean(visibleTokenCount))
  const {containerRef} = useFocusZone(
    {
      focusOutBehavior: 'wrap',
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusableElementFilter: element => {
        return !element.getAttributeNames().includes('aria-hidden')
      },
      getNextFocusable: direction => {
        if (!selectedTokenIndex && selectedTokenIndex !== 0) {
          return undefined
        }

        let nextIndex = selectedTokenIndex + 1 // "+ 1" accounts for the first element: the text input

        if (direction === 'next') {
          nextIndex += 1
        }

        if (direction === 'previous') {
          nextIndex -= 1
        }

        if (nextIndex > tokens.length || nextIndex < 1) {
          return ref.current || undefined
        }

        return containerRef.current?.children[nextIndex] as HTMLElement
      },
    },
    [selectedTokenIndex],
  )

  const handleTokenRemove = (tokenId: string | number) => {
    onTokenRemove(tokenId)

    // HACK: wait a tick for the token node to be removed from the DOM
    setTimeout(() => {
      const nextElementToFocus = containerRef.current?.children[selectedTokenIndex || 0] as HTMLElement | undefined

      // when removing the first token by keying "Backspace" or "Delete",
      // `nextFocusableElement` is the div that wraps the input
      const firstFocusable =
        nextElementToFocus && isFocusable(nextElementToFocus)
          ? nextElementToFocus
          : (Array.from(containerRef.current?.children || []) as HTMLElement[]).find(el => isFocusable(el))

      if (firstFocusable) {
        firstFocusable.focus()
      } else {
        // if there are no tokens left, focus the input
        ref.current?.focus()
      }
    }, 0)
  }

  const handleTokenFocus: (tokenIndex: number) => FocusEventHandler = tokenIndex => () => {
    if (!disabled) setSelectedTokenIndex(tokenIndex)
  }

  const handleTokenBlur: FocusEventHandler = () => {
    setSelectedTokenIndex(undefined)

    // HACK: wait a tick and check the focused element before hiding truncated tokens
    // this prevents the tokens from hiding when the user is moving focus between tokens,
    // but still hides the tokens when the user blurs the token by tabbing out or clicking somewhere else on the page
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement) && visibleTokenCount) {
        setTokensAreTruncated(true)
      }
    }, 0)
  }

  const handleTokenKeyUp: KeyboardEventHandler = event => {
    if (event.key === 'Escape') {
      ref.current?.focus()
    }
  }

  const handleInputFocus: FocusEventHandler = event => {
    onFocus && onFocus(event)
    setSelectedTokenIndex(undefined)
    visibleTokenCount && setTokensAreTruncated(false)
  }

  const handleInputBlur: FocusEventHandler = event => {
    onBlur && onBlur(event)

    // HACK: wait a tick and check the focused element before hiding truncated tokens
    // this prevents the tokens from hiding when the user is moving focus from the input to a token,
    // but still hides the tokens when the user blurs the input by tabbing out or clicking somewhere else on the page
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement) && visibleTokenCount) {
        setTokensAreTruncated(true)
      }
    }, 0)
  }

  const handleInputKeyDown: KeyboardEventHandler = e => {
    if (onKeyDown) {
      onKeyDown(e)
    }

    if (ref.current?.value) {
      return
    }

    const lastToken = tokens[tokens.length - 1]

    if (e.key === 'Backspace' && lastToken) {
      handleTokenRemove(lastToken.id)

      if (ref.current) {
        // TODO: eliminate the first hack by making changes to the Autocomplete component
        //
        // HACKS:
        // 1. Directly setting `ref.current.value` instead of updating state because the autocomplete
        //    highlight behavior doesn't work correctly if we update the value with a setState action in onChange
        // 2. Adding an extra space so that when I backspace, it doesn't delete the last letter
        ref.current.value = `${lastToken.text} `
      }

      // HACK: for some reason we need to wait a tick for `.select()` to work
      setTimeout(() => {
        ref.current?.select()
      }, 0)
    }
  }

  const focusInput: MouseEventHandler = () => {
    ref.current?.focus()
  }

  const preventTokenClickPropagation: MouseEventHandler = event => {
    event.stopPropagation()
  }

  const visibleTokens = tokensAreTruncated ? tokens.slice(0, visibleTokenCount) : tokens
  const inputSizeMap: Record<TokenSizeKeys, TextInputSizes> = {
    small: 'small',
    medium: 'small',
    large: 'medium',
    xlarge: 'medium',
  }
  const showLeadingLoadingIndicator =
    loading && (loaderPosition === 'leading' || Boolean(LeadingVisual && loaderPosition !== 'trailing'))
  const showTrailingLoadingIndicator =
    loading && (loaderPosition === 'trailing' || (loaderPosition === 'auto' && !LeadingVisual))

  return (
    <TextInputWrapper
      block={block}
      contrast={contrast}
      disabled={disabled}
      hasLeadingVisual={Boolean(LeadingVisual || showLeadingLoadingIndicator)}
      hasTrailingVisual={Boolean(TrailingVisual || showTrailingLoadingIndicator)}
      width={widthProp}
      minWidth={minWidthProp}
      maxWidth={maxWidthProp}
      size={inputSizeMap[size]}
      validationStatus={validationStatus}
      variant={variantProp} // deprecated. use `size` prop instead
      onClick={focusInput}
      data-token-wrapping={Boolean(preventTokenWrapping || maxHeight) || undefined}
      className={clsx(className, styles.TextInputWrapper)}
      style={maxHeight ? {maxHeight, ...style} : style}
    >
      {IconComponent && !LeadingVisual && <IconComponent className="TextInput-icon" />}
      <TextInputInnerVisualSlot
        hasLoadingIndicator={typeof loading === 'boolean'}
        visualPosition="leading"
        showLoadingIndicator={showLeadingLoadingIndicator}
      >
        {typeof LeadingVisual !== 'string' && isValidElementType(LeadingVisual) ? <LeadingVisual /> : LeadingVisual}
      </TextInputInnerVisualSlot>
      <div
        ref={containerRef as RefObject<HTMLDivElement>}
        className={styles.Container}
        data-prevent-token-wrapping={preventTokenWrapping}
      >
        <div className={styles.InputWrapper}>
          <UnstyledTextInput
            ref={ref}
            disabled={disabled}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            type="text"
            className={styles.UnstyledTextInput}
            aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
            {...inputPropsRest}
          />
        </div>
        {visibleTokens.map(({id, ...tokenRest}, i) => (
          <TokenComponent
            disabled={disabled}
            key={id}
            onFocus={handleTokenFocus(i)}
            onBlur={handleTokenBlur}
            onKeyUp={handleTokenKeyUp}
            onClick={preventTokenClickPropagation}
            isSelected={selectedTokenIndex === i}
            onRemove={() => {
              handleTokenRemove(id)
            }}
            hideRemoveButton={disabled || hideTokenRemoveButtons}
            size={size}
            tabIndex={0}
            {...tokenRest}
          />
        ))}
        {tokensAreTruncated && tokens.length - visibleTokens.length ? (
          <Text className={overflowCountClassMap[size]}>+{tokens.length - visibleTokens.length}</Text>
        ) : null}
      </div>
      <TextInputInnerVisualSlot
        hasLoadingIndicator={typeof loading === 'boolean'}
        visualPosition="trailing"
        showLoadingIndicator={showTrailingLoadingIndicator}
      >
        {typeof TrailingVisual !== 'string' && isValidElementType(TrailingVisual) ? <TrailingVisual /> : TrailingVisual}
      </TextInputInnerVisualSlot>
    </TextInputWrapper>
  )
}

const TextInputWithTokens = React.forwardRef(TextInputWithTokensInnerComponent)

TextInputWithTokens.displayName = 'TextInputWithTokens'

/**
 * @deprecated
 */
export default TextInputWithTokens
