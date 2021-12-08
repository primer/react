import React, {FocusEventHandler, KeyboardEventHandler, MouseEventHandler, RefObject, useRef, useState} from 'react'
import {omit} from '@styled-system/props'
import {FocusKeys} from '@primer/behaviors'
import {useCombinedRefs} from './hooks/useCombinedRefs'
import {useFocusZone} from './hooks/useFocusZone'
import {ComponentProps} from './utils/types'
import Token from './Token/Token'
import {TokenSizeKeys} from './Token/TokenBase'
import {TextInputProps} from './TextInput'
import {useProvidedRefOrCreate} from './hooks'
import UnstyledTextInput from './_UnstyledTextInput'
import TextInputWrapper from './_TextInputWrapper'
import Box from './Box'
import Text from './Text'
import {isFocusable} from '@primer/behaviors/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReactComponent = React.ComponentType<any>

// NOTE: if these props or their JSDoc comments are updated, be sure to also update
// the prop table in docs/content/TextInputTokens.mdx
type TextInputWithTokensInternalProps<TokenComponentType extends AnyReactComponent> = {
  /**
   * The array of tokens to render
   */
  tokens: TokenComponentType extends React.ComponentType<infer TokenProps> ? TokenProps[] : never
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
   * The size of the tokens
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
} & TextInputProps

const overflowCountFontSizeMap: Record<TokenSizeKeys, number> = {
  small: 0,
  medium: 1,
  large: 1,
  extralarge: 2
}

// using forwardRef is important so that other components (ex. Autocomplete) can use the ref
function TextInputWithTokensInnerComponent<TokenComponentType extends AnyReactComponent>(
  {
    icon: IconComponent,
    contrast,
    className,
    block,
    disabled,
    theme,
    sx: sxProp,
    tokens,
    onTokenRemove,
    tokenComponent: TokenComponent,
    preventTokenWrapping,
    size,
    hideTokenRemoveButtons,
    maxHeight,
    width: widthProp,
    minWidth: minWidthProp,
    maxWidth: maxWidthProp,
    variant: variantProp,
    visibleTokenCount,
    ...rest
  }: TextInputWithTokensInternalProps<TokenComponentType> & {
    selectedTokenIndex: number | undefined
    setSelectedTokenIndex: React.Dispatch<React.SetStateAction<number | undefined>>
  },
  externalRef: React.ForwardedRef<HTMLInputElement>
) {
  const {onBlur, onFocus, onKeyDown, ...inputPropsRest} = omit(rest)
  const ref = useProvidedRefOrCreate<HTMLInputElement>(externalRef as React.RefObject<HTMLInputElement>)
  const localInputRef = useRef<HTMLInputElement>(null)
  const combinedInputRef = useCombinedRefs(localInputRef, ref)
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
          return combinedInputRef.current || undefined
        }

        return containerRef.current?.children[nextIndex] as HTMLElement
      }
    },
    [selectedTokenIndex]
  )

  const handleTokenRemove = (tokenId: string | number) => {
    onTokenRemove(tokenId)

    // HACK: wait a tick for the the token node to be removed from the DOM
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
    setSelectedTokenIndex(tokenIndex)
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
    combinedInputRef.current?.focus()
  }

  const preventTokenClickPropagation: MouseEventHandler = event => {
    event.stopPropagation()
  }

  const visibleTokens = tokensAreTruncated ? tokens.slice(0, visibleTokenCount) : tokens

  return (
    <TextInputWrapper
      block={block}
      className={className}
      contrast={contrast}
      disabled={disabled}
      hasIcon={!!IconComponent}
      theme={theme}
      width={widthProp}
      minWidth={minWidthProp}
      maxWidth={maxWidthProp}
      variant={variantProp}
      onClick={focusInput}
      sx={{
        ...(block
          ? {
              display: 'flex',
              width: '100%'
            }
          : {}),

        ...(maxHeight
          ? {
              maxHeight,
              overflow: 'auto'
            }
          : {}),

        ...(preventTokenWrapping
          ? {
              overflow: 'auto'
            }
          : {}),

        ...sxProp
      }}
    >
      <Box
        ref={containerRef as RefObject<HTMLDivElement>}
        display="flex"
        sx={{
          alignItems: 'center',
          flexWrap: preventTokenWrapping ? 'nowrap' : 'wrap',
          marginLeft: '-0.25rem',
          marginBottom: '-0.25rem',
          flexGrow: 1,

          '> *': {
            flexShrink: 0,
            marginLeft: '0.25rem',
            marginBottom: '0.25rem'
          }
        }}
      >
        <Box
          sx={{
            order: 1,
            flexGrow: 1
          }}
        >
          {IconComponent && <IconComponent className="TextInput-icon" />}
          <UnstyledTextInput
            ref={combinedInputRef}
            disabled={disabled}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            type="text"
            sx={{height: '100%'}}
            {...inputPropsRest}
          />
        </Box>
        {TokenComponent
          ? visibleTokens.map(({id, ...tokenRest}, i) => (
              <TokenComponent
                key={id}
                onFocus={handleTokenFocus(i)}
                onBlur={handleTokenBlur}
                onKeyUp={handleTokenKeyUp}
                onClick={preventTokenClickPropagation}
                isSelected={selectedTokenIndex === i}
                onRemove={() => {
                  handleTokenRemove(id)
                }}
                hideRemoveButton={hideTokenRemoveButtons}
                size={size}
                tabIndex={0}
                {...tokenRest}
              />
            ))
          : null}
        {tokensAreTruncated ? (
          <Text color="fg.muted" fontSize={size && overflowCountFontSizeMap[size]}>
            +{tokens.length - visibleTokens.length}
          </Text>
        ) : null}
      </Box>
    </TextInputWrapper>
  )
}

const TextInputWithTokens = React.forwardRef(TextInputWithTokensInnerComponent)

TextInputWithTokens.defaultProps = {
  tokenComponent: Token,
  size: 'extralarge',
  hideTokenRemoveButtons: false,
  preventTokenWrapping: false
}

TextInputWithTokens.displayName = 'TextInputWithTokens'

export type TextInputWithTokensProps = ComponentProps<typeof TextInputWithTokens>
export default TextInputWithTokens
