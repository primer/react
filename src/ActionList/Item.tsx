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
export interface ItemProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'id'>, SxProp {
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
}

const getItemVariant = (variant = 'default', disabled?: boolean) => {
  if (disabled) {
    return {
      color: get('colors.text.disabled'),
      iconColor: get('colors.text.disabled'),
      annotationColor: get('colors.text.disabled'),
      hoverCursor: 'default'
    }
  }

  switch (variant) {
    case 'danger':
      return {
        color: get('colors.text.danger'),
        iconColor: get('colors.icon.danger'),
        annotationColor: get('colors.text.disabled'),
        hoverCursor: 'pointer'
      }
    default:
      return {
        color: 'inherit',
        iconColor: get('colors.text.secondary'),
        annotationColor: get('colors.text.secondary'),
        hoverCursor: 'pointer'
      }
  }
}

const StyledItemContent = styled.div`
  display: flex;
  min-width: 0;
  flex-grow: 1;
  position: relative;
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

    ${StyledItemContent}::before {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      top: -7px;
      // NB: This 'get' won’t execute if it’s moved into the arrow function below.
      border: 0 solid ${get('colors.selectMenu.borderSecondary')};
      border-top-width: ${({showDivider}) => (showDivider ? `1px` : '0')};
    }
  }

  // Item dividers should not be visible:
  // - above Hovered
  &:hover ${StyledItemContent}::before,
  // - below Hovered
  // '*' instead of '&' because '&' maps to separate class names depending on 'variant'
  :hover + * ${StyledItemContent}::before {
    // allow override in case another item in the list is active/focused
    border-color: var(--item-hover-divider-border-color-override, transparent) !important;
  }

  // - above Focused
  &:focus ${StyledItemContent}::before,
  // - below Focused
  // '*' instead of '&' because '&' maps to separate class names depending on 'variant'
  :focus + * ${StyledItemContent}::before,
  // - above Active Descendent
  &[${isActiveDescendantAttribute}] ${StyledItemContent}::before,
  // - below Active Descendent
  [${isActiveDescendantAttribute}] + & ${StyledItemContent}::before {
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

export const TextContainer = styled.div<{
  dangerouslySetInnerHtml?: React.DOMAttributes<HTMLDivElement>['dangerouslySetInnerHTML']
  descriptionVariant: ItemProps['descriptionVariant']
}>`
  display: flex;
  min-width: 0;
  flex-grow: 1;
  flex-direction: ${({descriptionVariant}) => (descriptionVariant === 'inline' ? 'row' : 'column')};
  align-items: baseline;
`

const BaseVisualContainer = styled.div<{variant?: ItemProps['variant']; disabled?: boolean}>`
  // Match visual height to adjacent text line height.
  // TODO: When rem-based spacing on a 4px scale lands, replace
  // hardcoded '20px' with '${get('space.s20')}'.
  height: 20px;
  width: ${get('space.3')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: ${get('space.2')};
`

const ColoredVisualContainer = styled(BaseVisualContainer)`
  svg {
    fill: ${({variant, disabled}) => getItemVariant(variant, disabled).iconColor};
    font-size: ${get('fontSizes.0')};
  }
`

const LeadingVisualContainer = styled(ColoredVisualContainer)``

const TrailingVisualContainer = styled(ColoredVisualContainer)`
  color: ${({variant, disabled}) => getItemVariant(variant, disabled).annotationColor}};
  margin-left: ${get('space.2')};
  margin-right: 0;
  div:nth-child(2) {
    margin-left: ${get('space.2')};
  }
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const DescriptionContainer = styled.span<{descriptionVariant: ItemProps['descriptionVariant']}>`
  color: ${get('colors.text.secondary')};
  font-size: ${get('fontSizes.0')};
  // TODO: When rem-based spacing on a 4px scale lands, replace
  // hardcoded '16px' with '${get('lh-12')}'.
  line-height: 16px;
  margin-left: ${({descriptionVariant}) => (descriptionVariant === 'inline' ? get('space.2') : 0)};
  min-width: 0;
  flex-grow: 1;
  flex-basis: ${({descriptionVariant}) => (descriptionVariant === 'inline' ? 0 : 'auto')};
`

const MultiSelectInput = styled.input`
  pointer-events: none;
`

/**
 * An actionable or selectable `Item` with an optional icon and description.
 */
export function Item(itemProps: Partial<ItemProps> & {item?: ItemInput}): JSX.Element {
  const {
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
        onAction?.(itemProps as ItemProps, event)
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
        onAction?.(itemProps as ItemProps, event)
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
      tabIndex={disabled ? undefined : -1}
      variant={variant}
      showDivider={showDivider}
      aria-selected={selected}
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
      <StyledItemContent>
        {children}
        {(text || description) && (
          <TextContainer descriptionVariant={descriptionVariant}>
            {text && <div>{text}</div>}
            {description && (
              <DescriptionContainer descriptionVariant={descriptionVariant}>
                {descriptionVariant === 'block' ? (
                  description
                ) : (
                  <Truncate title={description} inline={true} maxWidth="100%">
                    {description}
                  </Truncate>
                )}
              </DescriptionContainer>
            )}
          </TextContainer>
        )}
        {(TrailingIcon || trailingText) && (
          <TrailingVisualContainer variant={variant} disabled={disabled}>
            {trailingText && <div>{trailingText}</div>}
            {TrailingIcon && (
              <div>
                <TrailingIcon />
              </div>
            )}
          </TrailingVisualContainer>
        )}
      </StyledItemContent>
    </StyledItem>
  )
}
