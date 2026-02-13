import React, {useState, useRef, useCallback} from 'react'
import classes from './Breadcrumbs.module.css'
import Details from '../Details'
import {ActionList} from '../ActionList'
import {IconButton} from '../Button/IconButton'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'

export type BreadcrumbsOverflowMenuProps = {
  /**
   * The breadcrumb items to display in the overflow menu
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: React.ReactElement<any>[]
  /**
   * Accessible label for the menu button
   */
  'aria-label'?: string
}

/**
 * Overflow menu component for Breadcrumbs.
 * Displays hidden breadcrumb items in a dropdown menu.
 *
 * @example
 * ```tsx
 * <BreadcrumbsOverflowMenu
 *   items={hiddenItems}
 *   aria-label="3 more breadcrumb items"
 * />
 * ```
 */
export const BreadcrumbsOverflowMenu = React.forwardRef<HTMLDetailsElement, BreadcrumbsOverflowMenuProps>(
  ({items, 'aria-label': ariaLabel, ...rest}, menuRefCallback) => {
    const [isOpen, setIsOpen] = useState(false)
    const detailsRef = useRef<HTMLDetailsElement | null>(null)
    const menuButtonRef = useRef<HTMLButtonElement | null>(null)
    const menuContainerRef = useRef<HTMLDivElement>(null)

    const detailsRefCallback = useCallback(
      (element: HTMLDetailsElement | null) => {
        detailsRef.current = element
        if (typeof menuRefCallback === 'function') {
          menuRefCallback(element)
        }
      },
      [menuRefCallback],
    )

    const handleSummaryClick = useCallback((event: React.MouseEvent) => {
      // Prevent the button click from bubbling up and interfering with details toggle
      event.preventDefault()
      // Manually toggle the details element
      if (detailsRef.current) {
        const newOpenState = !detailsRef.current.open
        detailsRef.current.open = newOpenState
        setIsOpen(newOpenState)
      }
    }, [])

    const closeOverlay = useCallback(() => {
      if (detailsRef.current) {
        detailsRef.current.open = false
        setIsOpen(false)
      }
    }, [])

    const focusOnMenuButton = useCallback(() => {
      menuButtonRef.current?.focus()
    }, [])

    useOnEscapePress(
      (event: KeyboardEvent) => {
        if (isOpen) {
          event.preventDefault()
          closeOverlay()
          focusOnMenuButton()
        }
      },
      [isOpen],
    )

    useOnOutsideClick({
      onClickOutside: closeOverlay,
      containerRef: menuContainerRef,
      ignoreClickRefs: [menuButtonRef],
    })

    return (
      <Details ref={detailsRefCallback} className={classes.MenuDetails}>
        <IconButton
          as="summary"
          role="button"
          ref={menuButtonRef}
          aria-label={ariaLabel || `${items.length} more breadcrumb items`}
          aria-expanded={isOpen ? 'true' : 'false'}
          onClick={handleSummaryClick}
          variant="invisible"
          size="small"
          icon={KebabHorizontalIcon}
          tooltipDirection="e"
          {...rest}
        />
        <div ref={menuContainerRef} className={classes.MenuOverlay}>
          <ActionList>
            {items.map((item, index) => {
              const href = item.props.href
              const children = item.props.children
              const selected = item.props.selected
              return (
                <ActionList.LinkItem
                  key={index}
                  href={href}
                  aria-current={selected ? 'page' : undefined}
                  className={classes.MenuItem}
                >
                  {children}
                </ActionList.LinkItem>
              )
            })}
          </ActionList>
        </div>
      </Details>
    )
  },
)

BreadcrumbsOverflowMenu.displayName = 'BreadcrumbsOverflowMenu'
