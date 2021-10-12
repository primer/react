import React, {FocusEventHandler, KeyboardEventHandler, useRef, useState} from 'react'
import {omit} from '@styled-system/props'
import {FocusKeys} from './behaviors/focusZone'
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
} & TextInputProps

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
    ...rest
  }: TextInputWithTokensInternalProps<TokenComponentType> & {
    selectedTokenIndex: number | undefined
    setSelectedTokenIndex: React.Dispatch<React.SetStateAction<number | undefined>>
  },
  externalRef: React.ForwardedRef<HTMLInputElement>
) {
  const {onFocus, onKeyDown, ...inputPropsRest} = omit(rest)
  const ref = useProvidedRefOrCreate<HTMLInputElement>(externalRef as React.RefObject<HTMLInputElement>)
  const localInputRef = useRef<HTMLInputElement>(null)
  const combinedInputRef = useCombinedRefs(localInputRef, ref)
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | undefined>()
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

    if (selectedTokenIndex) {
      const nextElementToFocus = containerRef.current?.children[selectedTokenIndex] as HTMLElement
      nextElementToFocus.focus()
    }
  }

  const handleTokenFocus: (tokenIndex: number) => FocusEventHandler = tokenIndex => () => {
    setSelectedTokenIndex(tokenIndex)
  }

  const handleTokenBlur: FocusEventHandler = () => {
    setSelectedTokenIndex(undefined)
  }

  const handleTokenKeyUp: KeyboardEventHandler = e => {
    if (e.key === 'Escape') {
      ref.current?.focus()
    }
  }

  const handleInputFocus: FocusEventHandler = e => {
    onFocus && onFocus(e)
    setSelectedTokenIndex(undefined)
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
      ref={containerRef}
      sx={{
        alignItems: 'center',
        flexWrap: preventTokenWrapping ? 'nowrap' : 'wrap',
        gap: '0.25rem',

        '> *': {
          flexShrink: 0
        },

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
          onKeyDown={handleInputKeyDown}
          type="text"
          sx={{height: '100%'}}
          {...inputPropsRest}
        />
      </Box>
      {tokens.length && TokenComponent
        ? tokens.map(({id, ...tokenRest}, i) => (
            <TokenComponent
              key={id}
              onFocus={handleTokenFocus(i)}
              onBlur={handleTokenBlur}
              onKeyUp={handleTokenKeyUp}
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
