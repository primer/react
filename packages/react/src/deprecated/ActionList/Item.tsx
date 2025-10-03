import {CheckIcon} from '@primer/octicons-react'
import React, {useCallback} from 'react'
import {isValidElementType} from 'react-is'
import styled from 'styled-components'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import Truncate from '../../Truncate'
import type {ItemInput} from './List'
import {useTheme} from '../../ThemeProvider'
import {
  activeDescendantActivatedDirectly,
  activeDescendantActivatedIndirectly,
  isActiveDescendantAttribute,
} from '@primer/behaviors'
import {useId} from '../../hooks/useId'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'
import type {AriaRole} from '../../utils/types'
import classes from './Item.module.css'

// TODO: remove this when we fully migrate away from styled-components
// Temporary styled div wrapper for sx prop compatibility
const StyledItemWrapper = styled.div<SxProp>`
  ${sx};
`

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
  leadingVisual?: React.ElementType

  /**
   * @deprecated Use `trailingVisual` instead
   * Icon (or similar) positioned after `Item` text.
   */
  trailingIcon?: React.ElementType

  /**
   * @deprecated Use `trailingVisual` instead
   * Text positioned after `Item` text and optional trailing icon.
   */
  trailingText?: string

  /**
   * Icon or text positioned after `Item` text.
   */
  trailingVisual?: React.ElementType | React.ReactNode

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
  selectionVariant?: 'single' | 'multiple' | 'radio'

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
   * Key press event handler.
   */
  onKeyPress?: (event: React.KeyboardEvent<HTMLDivElement>) => void

  /**
   * Click event handler.
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void

  /**
   * Inline styles for the component.
   */
  style?: React.CSSProperties

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

export interface TextContainerProps {
  dangerouslySetInnerHtml?: React.DOMAttributes<HTMLDivElement>['dangerouslySetInnerHTML']
}

const getItemVariant = (variant = 'default', disabled?: boolean) => {
  if (disabled) {
    return {
      color: get('colors.primer.fg.disabled'),
      iconColor: get('colors.primer.fg.disabled'),
      annotationColor: get('colors.primer.fg.disabled'),
      hoverCursor: 'default',
    }
  }

  switch (variant) {
    case 'danger':
      return {
        color: get('colors.danger.fg'),
        iconColor: get('colors.danger.fg'),
        annotationColor: get('colors.fg.muted'),
        hoverCursor: 'pointer',
        hoverBg: get('colors.actionListItem.danger.hoverBg'),
        focusBg: get('colors.actionListItem.danger.activeBg'),
        hoverText: get('colors.actionListItem.danger.hoverText'),
      }
    default:
      return {
        color: get('colors.fg.default'),
        iconColor: get('colors.fg.muted'),
        annotationColor: get('colors.fg.muted'),
        hoverCursor: 'pointer',
        hoverBg: get('colors.actionListItem.default.hoverBg'),
        focusBg: get('colors.actionListItem.default.activeBg'),
      }
  }
}

// Component helper functions for dynamic styling
const getStyledItemClasses = (variant?: ItemProps['variant'], disabled?: boolean) => {
  let className = classes.StyledItem
  if (disabled) {
    className += ` ${classes.Disabled}`
  } else if (variant === 'danger') {
    className += ` ${classes.Danger}`
  }
  return className
}

const getItemStyles = (variant?: ItemProps['variant'], disabled?: boolean, showDivider?: boolean, theme?: any) => {
  const itemVariant = getItemVariant(variant, disabled)

  return {
    '--item-color': itemVariant.color,
    '--item-hover-bg': itemVariant.hoverBg,
    '--item-hover-text': itemVariant.hoverText,
    '--item-hover-cursor': itemVariant.hoverCursor,
    '--item-focus-bg': itemVariant.focusBg,
    '--item-icon-color': itemVariant.iconColor,
    '--item-annotation-color': itemVariant.annotationColor,
    '--divider-margin-top': showDivider ? '1px' : '0',
    '--divider-border-width': showDivider ? '1px' : '0',
  } as React.CSSProperties
}

const getMultiSelectIconStyles = (selected?: boolean, theme?: any) => {
  return {
    '--multiselect-rect-fill': selected ? get('colors.accent.fg')(theme) : get('colors.canvas.default')(theme),
    '--multiselect-rect-stroke': selected ? get('colors.accent.fg')(theme) : get('colors.border.default')(theme),
    '--multiselect-path-opacity': selected ? '1' : '0',
  } as React.CSSProperties
}

/**
 * An actionable or selectable `Item` with an optional icon and description.
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>((props, ref) => {
  const {
    text,
    description,
    descriptionVariant = 'inline',
    selected,
    selectionVariant,
    leadingVisual: LeadingVisual,
    trailingIcon: TrailingIcon,
    trailingVisual: TrailingVisual,
    trailingText,
    variant = 'default',
    showDivider,
    disabled,
    onAction,
    onKeyPress,
    children,
    onClick,
    id,
    sx: sxProp,
    ...restProps
  } = props

  const labelId = useId()
  const descriptionId = useId()

  const keyPressHandler = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return
      }
      onKeyPress?.(event)

      if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
        onAction?.(props, event)
      }
    },
    [onAction, disabled, props, onKeyPress],
  )

  const clickHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return
      }
      onClick?.(event)
      if (!event.defaultPrevented) {
        onAction?.(props, event)
      }
    },
    [onAction, disabled, props, onClick],
  )

  const {theme} = useTheme()

  const itemStyles = getItemStyles(variant, disabled, showDivider, theme)
  const multiSelectStyles = getMultiSelectIconStyles(selected, theme)

  return (
    <StyledItemWrapper sx={sxProp}>
      <div
        ref={ref}
        className={getStyledItemClasses(variant, disabled)}
        tabIndex={disabled ? undefined : -1}
        aria-selected={selected}
        aria-labelledby={text ? labelId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        {...restProps}
        style={{
          ...itemStyles,
          ...restProps.style,
        }}
        data-id={id}
        onKeyPress={keyPressHandler}
        onClick={clickHandler}
        {...{
          [isActiveDescendantAttribute]: restProps[isActiveDescendantAttribute as keyof typeof restProps],
        }}
      >
        {!!selected === selected && (
          <div className={classes.BaseVisualContainer}>
            {selectionVariant === 'multiple' ? (
              <>
                {/**
                 * we use a svg instead of an input because there should not
                 * be an interactive element inside an option
                 * svg copied from primer/css
                 */}
                <svg
                  className={classes.MultiSelectIcon}
                  style={multiSelectStyles}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="12" height="12" rx="4"></rect>
                  <path
                    fillRule="evenodd"
                    strokeWidth="0"
                    d="M4.03231 8.69862C3.84775 8.20646 4.49385 7.77554 4.95539 7.77554C5.41693 7.77554 6.80154 9.85246 6.80154 9.85246C6.80154 9.85246 10.2631 4.314 10.4938 4.08323C10.7246 3.85246 11.8785 4.08323 11.4169 5.00631C11.0081 5.82388 7.26308 11.4678 7.26308 11.4678C7.26308 11.4678 6.80154 12.1602 6.34 11.4678C5.87846 10.7755 4.21687 9.19077 4.03231 8.69862Z"
                  />
                </svg>
              </>
            ) : (
              selected && <CheckIcon fill={theme?.colors.fg.default} />
            )}
          </div>
        )}
        {LeadingVisual && (
          <div className={classes.LeadingVisualContainer}>
            <LeadingVisual />
          </div>
        )}
        <div className={classes.DividedContent}>
          <div
            className={classes.MainContent}
            style={
              {
                '--main-content-flex-direction': descriptionVariant === 'inline' ? 'row' : 'column',
              } as React.CSSProperties
            }
          >
            {children}
            {text ? <span id={labelId}>{text}</span> : null}
            {description ? (
              <span
                className={classes.DescriptionContainer}
                id={descriptionId}
                style={
                  {
                    '--description-container-margin-left': descriptionVariant === 'inline' ? get('space.2')(theme) : 0,
                    '--description-container-flex-basis': descriptionVariant === 'inline' ? 0 : 'auto',
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
              </span>
            ) : null}
          </div>
          {/* backward compatibility: prefer TrailingVisual but fallback to TrailingIcon */}
          {TrailingVisual ? (
            <div className={classes.TrailingContent}>
              {typeof TrailingVisual !== 'string' && isValidElementType(TrailingVisual) ? (
                <TrailingVisual />
              ) : (
                TrailingVisual
              )}
            </div>
          ) : TrailingIcon || trailingText ? (
            <div className={classes.TrailingContent}>
              {trailingText}
              {TrailingIcon && <TrailingIcon />}
            </div>
          ) : null}
        </div>
        {LeadingVisual && (
          <div className={classes.leadingVisualContainer}>
            <LeadingVisual />
          </div>
        )}
        <div className={classes.dividedContent}>
          <div
            className={classes.mainContent}
            style={
              {
                '--main-content-flex-direction': descriptionVariant === 'inline' ? 'row' : 'column',
              } as React.CSSProperties
            }
          >
            {children}
            {text ? <span id={labelId}>{text}</span> : null}
            {description ? (
              <span
                className={classes.descriptionContainer}
                id={descriptionId}
                style={
                  {
                    '--description-container-margin-left': descriptionVariant === 'inline' ? get('space.2')(theme) : 0,
                    '--description-container-flex-basis': descriptionVariant === 'inline' ? 0 : 'auto',
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
              </span>
            ) : null}
          </div>
          {/* backward compatibility: prefer TrailingVisual but fallback to TrailingIcon */}
          {TrailingVisual ? (
            <div className={classes.trailingContent}>
              {typeof TrailingVisual !== 'string' && isValidElementType(TrailingVisual) ? (
                <TrailingVisual />
              ) : (
                TrailingVisual
              )}
            </div>
          ) : TrailingIcon || trailingText ? (
            <div className={classes.trailingContent}>
              {trailingText}
              {TrailingIcon && <TrailingIcon />}
            </div>
          ) : null}
        </div>
      </div>
    </StyledItemWrapper>
  )
}) as PolymorphicForwardRefComponent<'div', ItemProps>

Item.displayName = 'ActionList.Item'

export const TextContainer = 'span'
