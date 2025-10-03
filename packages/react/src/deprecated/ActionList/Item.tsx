import {CheckIcon} from '@primer/octicons-react'
import React, {useCallback} from 'react'
import {isValidElementType} from 'react-is'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import Truncate from '../../Truncate'
import type {ItemInput} from './List'
import {useTheme} from '../../ThemeProvider'
import {useId} from '../../hooks/useId'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'
import type {AriaRole} from '../../utils/types'

import classes from './Item.module.css'

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

/**
 * An actionable or selectable `Item` with an optional icon and description.
 */
export const Item = React.forwardRef((itemProps, ref) => {
  const {
    as: Component = 'div',
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
    ...props
  } = itemProps

  const labelId = useId()
  const descriptionId = useId()

  const keyPressHandler = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return
      }
      onKeyPress?.(event)

      if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
        onAction?.(itemProps, event)
      }
    },
    [onAction, disabled, itemProps, onKeyPress],
  )

  const clickHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return
      }
      onClick?.(event)
      if (!event.defaultPrevented) {
        onAction?.(itemProps, event)
      }
    },
    [onAction, disabled, itemProps, onClick],
  )

  const {theme} = useTheme()

  return (
    <Component
      ref={ref}
      tabIndex={disabled ? undefined : -1}
      data-variant={variant}
      aria-selected={selected}
      aria-labelledby={text ? labelId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      data-divider={showDivider ? '' : undefined}
      {...props}
      data-id={id}
      onKeyPress={keyPressHandler}
      onClick={clickHandler}
    >
      {!!selected === selected && (
        <div>
          {selectionVariant === 'multiple' ? (
            <>
              {/**
               * we use a svg instead of an input because there should not
               * be an interactive element inside an option
               * svg copied from primer/css
               */}
              <svg
                className={classes.MultiSelectIcon}
                data-selected={selected ? '' : undefined}
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
        <div
          className={classes.LeadingVisualContainer}
          data-variant={variant}
          data-disabled={disabled ? '' : undefined}
        >
          <LeadingVisual />
        </div>
      )}
      <div className={classes.DividedContent} data-component="ActionList.DividedContent">
        <div
          style={
            {'--main-content-flex-direction': descriptionVariant === 'inline' ? 'row' : 'column'} as React.CSSProperties
          }
          className={classes.MainContent}
        >
          {children}
          {text ? <span id={labelId}>{text}</span> : null}
          {description ? (
            <span
              id={descriptionId}
              style={
                {
                  '--description-container-margin-left': descriptionVariant === 'inline' ? get('space.2')(theme) : 0,
                  '--description-container-flex-basis': descriptionVariant === 'inline' ? 0 : 'auto',
                } as React.CSSProperties
              }
              className={classes.DescriptionContainer}
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
          <div className={classes.TrailingContent} data-variant={variant} data-disabled={disabled ? '' : undefined}>
            {typeof TrailingVisual !== 'string' && isValidElementType(TrailingVisual) ? (
              <TrailingVisual />
            ) : (
              TrailingVisual
            )}
          </div>
        ) : TrailingIcon || trailingText ? (
          <div className={classes.TrailingContent} data-variant={variant} data-disabled={disabled ? '' : undefined}>
            {trailingText}
            {TrailingIcon && <TrailingIcon />}
          </div>
        ) : null}
      </div>
    </Component>
  )
}) as PolymorphicForwardRefComponent<'div', ItemProps>

Item.displayName = 'ActionList.Item'
