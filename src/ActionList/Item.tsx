import {CheckIcon, IconProps} from '@primer/octicons-react'
import React, {useCallback} from 'react'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import Truncate from '../Truncate'
import {ItemInput} from './List'
import styled from 'styled-components'
import {StyledHeader} from './Header'
import {StyledDivider} from './Divider'
import {useColorSchemeVar, useTheme} from '../ThemeProvider'
import {
  activeDescendantActivatedDirectly,
  activeDescendantActivatedIndirectly,
  isActiveDescendantAttribute
} from '../behaviors/focusZone'
import {useSSRSafeId} from '@react-aria/ssr'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {AriaRole} from '../utils/types'

/**
 * These colors are not yet in our default theme.  Need to remove this once they are added.
 */
const customItemThemes = {
  default: {
    hover: {
      light: 'rgba(46, 77, 108, 0.06)',
      dark: 'rgba(201, 206, 212, 0.12)',
      dark_dimmed: 'rgba(201, 206, 212, 0.12)'
    },
    focus: {
      light: 'rgba(54, 77, 100, 0.16)',
      dark: 'rgba(201, 206, 212, 0.24)',
      dark_dimmed: 'rgba(201, 206, 212, 0.24)'
    }
  },
  danger: {
    hover: {
      light: 'rgba(234, 74, 90, 0.08)',
      dark: 'rgba(248, 81, 73, 0.16)',
      dark_dimmed: 'rgba(248, 81, 73, 0.16)'
    },
    focus: {
      light: 'rgba(234, 74, 90, 0.14)',
      dark: 'rgba(248, 81, 73, 0.24)',
      dark_dimmed: 'rgba(248, 81, 73, 0.24)'
    }
  }
} as const

/**
 * Contract for props passed to the `Item` component.
 */
export interface ItemProps extends SxProp {
  /**
   * Primary text which names an `Item`.
   */
  text?: string

  /**
   * Secondary text which provides additional information about an `Item`.
   */
  description?: string

  /**
   * Secondary text style variations. Usage is discretionary.
   *
   * - `"inline"` - Secondary text is positioned beside primary text.
   * - `"block"` - Secondary text is positioned below primary text.
   */
  descriptionVariant?: 'inline' | 'block'

  /**
   * Icon (or similar) positioned before `Item` text.
   */
  leadingVisual?: React.FunctionComponent<IconProps>

  /**
   * Icon (or similar) positioned after `Item` text.
   */
  trailingIcon?: React.FunctionComponent<IconProps>

  /**
   * Text positioned after `Item` text and optional trailing icon.
   */
  trailingText?: string

  /**
   * Style variations associated with various `Item` types.
   *
   * - `"default"` - An action `Item`.
   * - `"danger"` - A destructive action `Item`.
   */
  variant?: 'default' | 'danger'

  /**
   * Whether to display a divider above the `Item` when it does not follow a `Header` or `Divider`.
   */
  showDivider?: boolean

  /**
   * For `Item`s which can be selected, whether the `Item` is currently selected.
   */
  selected?: boolean

  /**
   *  For `Item`s which can be selected, whether `multiple` `Item`s or a `single` `Item` can be selected
   */
  selectionVariant?: 'single' | 'multiple'

  /**
   * Designates the group that an item belongs to.
   */
  groupId?: string

  /**
   * Items that are disabled can not be clicked, selected, or navigated through.
   */
  disabled?: boolean

  /**
   * Callback that will trigger both on click selection and keyboard selection.
   */
  onAction?: (item: ItemProps, event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void

  /**
   * An id associated with this item.  Should be unique between items
   */
  id?: number | string

  /**
   * Node to be included inside the item before the text.
   */
  children?: React.ReactNode

  /**
   * The ARIA role describing the function of `List` component. `option` is a common value.
   */
  role?: AriaRole

  /**
   * An item to pass back in the `onAction` callback, meant as
   */
  item?: ItemInput
}

const getItemVariant = (variant = 'default', disabled?: boolean) => {
  if (disabled) {
    return {
      color: get('colors.fg.muted'),
      iconColor: get('colors.fg.muted'),
      annotationColor: get('colors.fg.muted'),
      hoverCursor: 'default'
    }
  }

  switch (variant) {
    case 'danger':
      return {
        color: get('colors.danger.fg'),
        iconColor: get('colors.danger.fg'),
        annotationColor: get('colors.fg.muted'),
        hoverCursor: 'pointer'
      }
    default:
      return {
        color: get('colors.fg.default'),
        iconColor: get('colors.fg.muted'),
        annotationColor: get('colors.fg.muted'),
        hoverCursor: 'pointer'
      }
  }
}

const DividedContent = styled.div`
  display: flex;
  min-width: 0;

  /* Required for dividers */
  position: relative;
  flex-grow: 1;
`

const MainContent = styled.div`
  align-items: baseline;
  display: flex;
  min-width: 0;
  flex-direction: var(--main-content-flex-direction);
  flex-grow: 1;
`

const StyledItem = styled.div<
  {
    variant: ItemProps['variant']
    showDivider: ItemProps['showDivider']
    item?: ItemInput
    hoverBackground: string
    focusBackground: string
  } & SxProp
>`
  /* 6px vertical padding + 20px line height = 32px total height
   *
   * TODO: When rem-based spacing on a 4px scale lands, replace
   * hardcoded '6px' with 'calc((${get('space.s32')} - ${get('space.20')}) / 2)'.
   */
  padding: 6px ${get('space.2')};
  display: flex;
  border-radius: ${get('radii.2')};
  color: ${({variant, item}) => getItemVariant(variant, item?.disabled).color};
  // 2 frames on a 60hz monitor
  transition: background 33.333ms linear;
  text-decoration: none;

  @media (hover: hover) and (pointer: fine) {
    :hover {
      // allow override in case another item in the list is active/focused
      background: var(--item-hover-bg-override, ${({hoverBackground}) => hoverBackground});
      cursor: ${({variant, item}) => getItemVariant(variant, item?.disabled).hoverCursor};
    }
  }

  // Item dividers
  :not(:first-of-type):not(${StyledDivider} + &):not(${StyledHeader} + &) {
    margin-top: ${({showDivider}) => (showDivider ? `1px` : '0')};

    ${DividedContent}::before {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      top: -7px;
      // NB: This 'get' won’t execute if it’s moved into the arrow function below.
      border: 0 solid ${get('colors.border.muted')};
      border-top-width: ${({showDivider}) => (showDivider ? `1px` : '0')};
    }
  }

  // Item dividers should not be visible:
  // - above Hovered
  &:hover ${DividedContent}::before,
  // - below Hovered
  // '*' instead of '&' because '&' maps to separate class names depending on 'variant'
  :hover + * ${DividedContent}::before {
    // allow override in case another item in the list is active/focused
    border-color: var(--item-hover-divider-border-color-override, transparent) !important;
  }

  // - above Focused
  &:focus ${DividedContent}::before,
  // - below Focused
  // '*' instead of '&' because '&' maps to separate class names depending on 'variant'
  :focus + * ${DividedContent}::before,
  // - above Active Descendent
  &[${isActiveDescendantAttribute}] ${DividedContent}::before,
  // - below Active Descendent
  [${isActiveDescendantAttribute}] + & ${DividedContent}::before {
    // '!important' because all the ':not's above give higher specificity
    border-color: transparent !important;
  }

  // Active Descendant
  &[${isActiveDescendantAttribute}='${activeDescendantActivatedDirectly}'] {
    background: ${({focusBackground}) => focusBackground};
  }
  &[${isActiveDescendantAttribute}='${activeDescendantActivatedIndirectly}'] {
    background: ${({hoverBackground}) => hoverBackground};
  }

  &:focus {
    background: ${({focusBackground}) => focusBackground};
    outline: none;
  }

  &:active {
    background: ${({focusBackground}) => focusBackground};
  }

  ${sx}
`

export const TextContainer = styled.span<{
  dangerouslySetInnerHtml?: React.DOMAttributes<HTMLDivElement>['dangerouslySetInnerHTML']
}>``

const BaseVisualContainer = styled.div<{variant?: ItemProps['variant']; disabled?: boolean}>`
  // Match visual height to adjacent text line height.
  // TODO: When rem-based spacing on a 4px scale lands, replace
  // hardcoded '20px' with '${get('space.s20')}'.
  height: 20px;
  width: ${get('space.3')};
  margin-right: ${get('space.2')};
`

const ColoredVisualContainer = styled(BaseVisualContainer)`
  svg {
    fill: ${({variant, disabled}) => getItemVariant(variant, disabled).iconColor};
    font-size: ${get('fontSizes.0')};
  }
`

const LeadingVisualContainer = styled(ColoredVisualContainer)`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TrailingContent = styled(ColoredVisualContainer)`
  color: ${({variant, disabled}) => getItemVariant(variant, disabled).annotationColor}};
  margin-left: ${get('space.2')};
  margin-right: 0;
  width: auto;
  div:nth-child(2) {
    margin-left: ${get('space.2')};
  }
`

const DescriptionContainer = styled.span`
  color: ${get('colors.fg.muted')};
  font-size: ${get('fontSizes.0')};
  // TODO: When rem-based spacing on a 4px scale lands, replace
  // hardcoded '16px' with '${get('lh-12')}'.
  line-height: 16px;
  margin-left: var(--description-container-margin-left);
  min-width: 0;
  flex-grow: 1;
  flex-basis: var(--description-container-flex-basis);
`

const MultiSelectInput = styled.input`
  pointer-events: none;
`

/**
 * An actionable or selectable `Item` with an optional icon and description.
 */
export const Item = React.forwardRef((itemProps, ref) => {
  const {
    as: Component,
    text,
    description,
    descriptionVariant = 'inline',
    selected,
    selectionVariant,
    leadingVisual: LeadingVisual,
    trailingIcon: TrailingIcon,
    trailingText,
    variant = 'default',
    showDivider,
    disabled,
    onAction,
    onKeyPress,
    children,
    onClick,
    id,
    ...props
  } = itemProps

  const labelId = useSSRSafeId()
  const descriptionId = useSSRSafeId()

  const keyPressHandler = useCallback(
    event => {
      if (disabled) {
        return
      }
      onKeyPress?.(event)
      const isCheckbox = event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
      if (isCheckbox && event.key === ' ') {
        // space key on a checkbox will also trigger a click event.  Ignore the space key so we don't get double events
        return
      }

      if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
        onAction?.(itemProps, event)
      }
    },
    [onAction, disabled, itemProps, onKeyPress]
  )

  const clickHandler = useCallback(
    event => {
      if (disabled) {
        return
      }
      onClick?.(event)
      if (!event.defaultPrevented) {
        onAction?.(itemProps, event)
      }
    },
    [onAction, disabled, itemProps, onClick]
  )

  const customItemTheme = customItemThemes[variant]
  const hoverBackground = useColorSchemeVar(customItemTheme.hover, 'inherit')
  const focusBackground = useColorSchemeVar(customItemTheme.focus, 'inherit')

  const {theme} = useTheme()

  return (
    <StyledItem
      ref={ref}
      as={Component}
      tabIndex={disabled ? undefined : -1}
      variant={variant}
      showDivider={showDivider}
      aria-selected={selected}
      aria-labelledby={text ? labelId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      {...props}
      data-id={id}
      onKeyPress={keyPressHandler}
      onClick={clickHandler}
      hoverBackground={disabled ? 'inherit' : hoverBackground}
      focusBackground={disabled ? 'inherit' : focusBackground}
    >
      {!!selected === selected && (
        <BaseVisualContainer>
          {selectionVariant === 'multiple' ? (
            <>
              {/*
               * readOnly is required because we are doing a one-way bind to `checked`.
               * aria-readonly="false" tells screen that they can still interact with the checkbox
               */}
              <MultiSelectInput
                disabled={disabled}
                tabIndex={-1}
                type="checkbox"
                checked={selected}
                aria-label={text}
                readOnly
                aria-readonly="false"
              />
            </>
          ) : (
            selected && <CheckIcon fill={theme?.colors.text.primary} />
          )}
        </BaseVisualContainer>
      )}
      {LeadingVisual && (
        <LeadingVisualContainer variant={variant} disabled={disabled}>
          <LeadingVisual />
        </LeadingVisualContainer>
      )}
      <DividedContent>
        <MainContent
          style={
            {'--main-content-flex-direction': descriptionVariant === 'inline' ? 'row' : 'column'} as React.CSSProperties
          }
        >
          {children}
          {text ? <TextContainer id={labelId}>{text}</TextContainer> : null}
          {description ? (
            <DescriptionContainer
              id={descriptionId}
              style={
                {
                  '--description-container-margin-left': descriptionVariant === 'inline' ? get('space.2')(theme) : 0,
                  '--description-container-flex-basis': descriptionVariant === 'inline' ? 0 : 'auto'
                } as React.CSSProperties
              }
            >
              {descriptionVariant === 'block' ? (
                description
              ) : (
                <Truncate title={description} inline={true} maxWidth="100%">
                  {description}
                </Truncate>
              )}
            </DescriptionContainer>
          ) : null}
        </MainContent>
        {TrailingIcon || trailingText ? (
          <TrailingContent variant={variant} disabled={disabled}>
            {trailingText}
            {TrailingIcon && <TrailingIcon />}
          </TrailingContent>
        ) : null}
      </DividedContent>
    </StyledItem>
  )
}) as PolymorphicForwardRefComponent<'div', ItemProps>

Item.displayName = 'ActionList.Item'
