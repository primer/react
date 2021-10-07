import React, {FocusEventHandler, KeyboardEventHandler, useRef, useState} from 'react'
import {omit} from '@styled-system/props'
import styled from 'styled-components'
import {FocusKeys} from './behaviors/focusZone'
import {useCombinedRefs} from './hooks/useCombinedRefs'
import {useFocusZone} from './hooks/useFocusZone'
import {ComponentProps} from './utils/types'
import Token from './Token/Token'
import {TokenSizeKeys} from './Token/TokenBase'
import TextInput, {TextInputProps} from './TextInput'
import {useProvidedRefOrCreate} from './hooks'
import UnstyledTextInput from './_UnstyledTextInput'

const InputWrapper = styled.div`
  order: 1;
  flex-grow: 1;
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReactComponent = React.ComponentType<any>

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
}

// The inner contents of `TextInputWithTokens` are separated so they may be passed to the `as`
// prop of the `TextInput` component
function TextInputWithTokensInnerComponent<TokenComponentType extends AnyReactComponent>(
  {
    tokens,
    onTokenRemove,
    tokenComponent: TokenComponent,
    size,
    hideTokenRemoveButtons,
    selectedTokenIndex,
    setSelectedTokenIndex,
    ...rest
  }: TextInputWithTokensInternalProps<TokenComponentType> & {
    selectedTokenIndex: number | undefined
    setSelectedTokenIndex: React.Dispatch<React.SetStateAction<number | undefined>>
  },
  externalRef: React.ForwardedRef<HTMLInputElement>
) {
  const ref = useProvidedRefOrCreate<HTMLInputElement>(externalRef as React.RefObject<HTMLInputElement>)
  const {onFocus, onKeyDown, ...inputPropsRest} = omit(rest)

  const handleTokenFocus: (tokenIndex: number) => FocusEventHandler = tokenIndex => () => {
    setSelectedTokenIndex(tokenIndex)
  }

  const handleTokenBlur: FocusEventHandler = () => {
    setSelectedTokenIndex(undefined)
  }

  const handleTokenKeyUp: KeyboardEventHandler = event => {
    if (event.key === 'Escape') {
      ref.current?.focus()
    }
  }

  const handleInputFocus: FocusEventHandler = event => {
    onFocus && onFocus(event)
    setSelectedTokenIndex(undefined)
  }
  const handleInputKeyDown: KeyboardEventHandler = event => {
    if (onKeyDown) {
      onKeyDown(event)
    }

    if (ref.current?.value) {
      return
    }

    const lastToken = tokens[tokens.length - 1]

    if (event.key === 'Backspace' && lastToken) {
      onTokenRemove(lastToken.id)

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
    <>
      <InputWrapper key="inputWrapper">
        <UnstyledTextInput
          ref={ref}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          type="text"
          sx={{height: '100%'}}
          {...inputPropsRest}
        />
      </InputWrapper>
      {tokens.length && TokenComponent
        ? tokens.map(({id, ...tokenRest}, i) => (
            <TokenComponent
              key={id}
              onFocus={handleTokenFocus(i)}
              onBlur={handleTokenBlur}
              onKeyUp={handleTokenKeyUp}
              isSelected={selectedTokenIndex === i}
              onRemove={() => {
                onTokenRemove(id)
              }}
              hideRemoveButton={hideTokenRemoveButtons}
              size={size}
              tabIndex={0}
              {...tokenRest}
            />
          ))
        : null}
    </>
  )
}

// using forwardRef is important so that other components (ex. Autocomplete) can use the ref
const TextInputWithTokensInnerComponentWithRef = React.forwardRef(TextInputWithTokensInnerComponent)

function TextInputWithTokensComponent<TokenComponentType extends AnyReactComponent>(
  {tokens, onTokenRemove, sx: sxProp, ...props}: TextInputWithTokensInternalProps<TokenComponentType> & TextInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
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

  return (
    <TextInput
      ref={combinedInputRef}
      wrapperRef={containerRef}
      as={TextInputWithTokensInnerComponentWithRef}
      selectedTokenIndex={selectedTokenIndex}
      setSelectedTokenIndex={setSelectedTokenIndex}
      tokens={tokens}
      onTokenRemove={handleTokenRemove}
      sx={{
        alignItems: 'center',
        flexWrap: props.preventTokenWrapping ? 'nowrap' : 'wrap',
        gap: '0.25rem',

        '> *': {
          flexShrink: 0
        },

        ...(props.block
          ? {
              display: 'flex',
              width: '100%'
            }
          : {}),

        ...(props.maxHeight
          ? {
              maxHeight: props.maxHeight,
              overflow: 'auto'
            }
          : {}),

        ...(props.preventTokenWrapping
          ? {
              overflow: 'auto'
            }
          : {}),

        ...sxProp
      }}
      {...props}
    />
  )
}

// using forwardRef is important so that other components (ex. Autocomplete) can use the ref
const TextInputWithTokens = React.forwardRef(TextInputWithTokensComponent)

TextInputWithTokens.defaultProps = {
  tokenComponent: Token,
  size: 'xlarge',
  hideTokenRemoveButtons: false
}

TextInputWithTokens.displayName = 'TextInputWithTokens'

export type TextInputWithTokensProps = ComponentProps<typeof TextInputWithTokens>
export default TextInputWithTokens
