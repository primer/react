import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import Details from '../Details'
import {ActionList} from '../ActionList'
import {IconButton} from '../Button/IconButton'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {useResizeObserver} from '../hooks/useResizeObserver'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import {useFeatureFlag} from '../FeatureFlags'

export type BreadcrumbsProps = React.PropsWithChildren<{
  /**
   * Optional class name for the breadcrumbs container.
   */
  className?: string
  /**
   * Controls the overflow behavior of the breadcrumbs.
   * By default all overflowing crumbs will "wrap" in the given space taking up extra height.
   * In the "menu" option we'll see the overflowing crumbs as part of a menu like dropdown instead of the root breadcrumb.
   * In "menu-with-root" we see that instead of the root, the menu button will take the place of the next breadcrumb.
   */
  overflow?: 'wrap' | 'menu' | 'menu-with-root'
  /**
   * Controls the visual variant of the breadcrumbs.
   * By default, the breadcrumbs will have a normal appearance.
   * In the "spacious" option, the breadcrumbs will have increased padding and a more relaxed layout.
   */
  variant?: 'normal' | 'spacious'
  /**
   * Allows passing of CSS custom properties to the breadcrumbs container.
   */
  style?: React.CSSProperties
}>

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  return <ol className={classes.BreadcrumbsList}>{children}</ol>
}

type BreadcrumbsMenuItemProps = {
  items: React.ReactElement[]
  'aria-label'?: string
}

const BreadcrumbsMenuItem = React.forwardRef<HTMLDetailsElement, BreadcrumbsMenuItemProps>(
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

BreadcrumbsMenuItem.displayName = 'Breadcrumbs.MenuItem'

const getValidChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}

function Breadcrumbs({className, children, style, overflow = 'wrap', variant = 'normal'}: BreadcrumbsProps) {
  const overflowMenuEnabled = useFeatureFlag('primer_react_breadcrumbs_overflow_menu')
  const wrappedChildren = React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
  const containerRef = useRef<HTMLElement>(null)

  const measureMenuButton = useCallback((element: HTMLDetailsElement | null) => {
    if (element) {
      const iconButtonElement = element.querySelector('button[data-component="IconButton"]')
      if (iconButtonElement) {
        const measuredWidth = (iconButtonElement as HTMLElement).offsetWidth
        setMenuButtonWidth(measuredWidth)
      }
    }
  }, [])

  const hideRoot = !(overflow === 'menu-with-root')
  const [effectiveHideRoot, setEffectiveHideRoot] = useState<boolean>(hideRoot)
  const childArray = useMemo(() => getValidChildren(children), [children])

  const rootItem = childArray[0]

  const [visibleItems, setVisibleItems] = useState<React.ReactElement[]>(() => childArray)
  const [childArrayWidths, setChildArrayWidths] = useState<number[]>(() => [])

  const [menuItems, setMenuItems] = useState<React.ReactElement[]>([])
  const [rootItemWidth, setRootItemWidth] = useState<number>(0)

  const MENU_BUTTON_FALLBACK_WIDTH = 32 // Design system small IconButton
  const [menuButtonWidth, setMenuButtonWidth] = useState(MENU_BUTTON_FALLBACK_WIDTH)

  useEffect(() => {
    const listElement = containerRef.current?.querySelector('ol')
    if (
      overflowMenuEnabled &&
      listElement &&
      listElement.children.length > 0 &&
      listElement.children.length === childArray.length
    ) {
      const listElementArray = Array.from(listElement.children) as HTMLElement[]
      const widths = listElementArray.map(child => child.offsetWidth)
      setChildArrayWidths(widths)
      setRootItemWidth(listElementArray[0].offsetWidth)
    }
  }, [childArray, overflowMenuEnabled])

  const calculateOverflow = useCallback(
    (availableWidth: number) => {
      let eHideRoot = effectiveHideRoot
      const MENU_BUTTON_WIDTH = menuButtonWidth
      const MIN_VISIBLE_ITEMS = !eHideRoot ? 3 : 4

      const calculateVisibleItemsWidth = (w: number[]) => {
        const widths = w.reduce((sum, width) => sum + width + 16, 0)
        return !eHideRoot ? rootItemWidth + widths : widths
      }

      let currentVisibleItems = [...childArray]
      let currentVisibleItemWidths = [...childArrayWidths]
      let currentMenuItems: React.ReactElement[] = []
      let currentMenuItemsWidths: number[] = []

      if (availableWidth > 0 && currentVisibleItemWidths.length > 0) {
        let visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItemWidths)

        if (currentMenuItems.length > 0) {
          visibleItemsWidthTotal += MENU_BUTTON_WIDTH
        }
        while (
          (overflow === 'menu' || overflow === 'menu-with-root') &&
          (visibleItemsWidthTotal > availableWidth || currentVisibleItems.length > MIN_VISIBLE_ITEMS)
        ) {
          const itemToHide = currentVisibleItems[0]
          const itemToHideWidth = currentVisibleItemWidths[0]
          currentMenuItems = [...currentMenuItems, itemToHide]
          currentMenuItemsWidths = [...currentMenuItemsWidths, itemToHideWidth]
          currentVisibleItems = currentVisibleItems.slice(1)
          currentVisibleItemWidths = currentVisibleItemWidths.slice(1)

          visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItemWidths)

          if (currentMenuItems.length > 0) {
            visibleItemsWidthTotal += MENU_BUTTON_WIDTH
          }

          if (currentVisibleItems.length === 1 && visibleItemsWidthTotal > availableWidth) {
            eHideRoot = true
            break
          } else {
            eHideRoot = hideRoot
          }
        }
      }
      return {
        visibleItems: currentVisibleItems,
        menuItems: currentMenuItems,
        effectiveHideRoot: eHideRoot,
      }
    },
    [childArray, childArrayWidths, effectiveHideRoot, hideRoot, overflow, rootItemWidth, menuButtonWidth],
  )

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (overflowMenuEnabled && entries[0]) {
        const containerWidth = entries[0].contentRect.width
        const result = calculateOverflow(containerWidth)
        if (
          (visibleItems.length !== result.visibleItems.length && menuItems.length !== result.menuItems.length) ||
          result.effectiveHideRoot !== effectiveHideRoot
        ) {
          setVisibleItems(result.visibleItems)
          setMenuItems(result.menuItems)
          setEffectiveHideRoot(result.effectiveHideRoot)
        }
      }
    },
    [calculateOverflow, effectiveHideRoot, menuItems.length, overflowMenuEnabled, visibleItems.length],
  )

  useResizeObserver(handleResize, containerRef)

  useEffect(() => {
    if (
      overflowMenuEnabled &&
      (overflow === 'menu' || overflow === 'menu-with-root') &&
      childArray.length > 5 &&
      menuItems.length === 0
    ) {
      const containerWidth = containerRef.current?.offsetWidth || 800
      const result = calculateOverflow(containerWidth)
      setVisibleItems(result.visibleItems)
      setMenuItems(result.menuItems)
      setEffectiveHideRoot(result.effectiveHideRoot)
    }
  }, [overflow, childArray, calculateOverflow, menuItems.length, overflowMenuEnabled])

  const finalChildren = React.useMemo(() => {
    if (overflowMenuEnabled) {
      if (overflow === 'wrap' || menuItems.length === 0) {
        return React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
      }

      let effectiveMenuItems = [...menuItems]
      // In 'menu-with-root' mode, include the root item inside the menu even if it's visible in the breadcrumbs
      if (!effectiveHideRoot) {
        effectiveMenuItems = [...menuItems.slice(1)]
      }
      const menuElement = (
        <li className={classes.BreadcrumbsItem} key="breadcrumbs-menu">
          <BreadcrumbsMenuItem
            ref={measureMenuButton}
            items={effectiveMenuItems}
            aria-label={`${effectiveMenuItems.length} more breadcrumb items`}
          />
          <ItemSeparator />
        </li>
      )

      const visibleElements = visibleItems.map((child, index) => (
        <li className={classes.BreadcrumbsItem} key={`visible + ${index}`}>
          {child}
          <ItemSeparator />
        </li>
      ))

      const rootElement = (
        <li className={classes.BreadcrumbsItem} key={`rootElement`}>
          {rootItem}
          <ItemSeparator />
        </li>
      )

      if (effectiveHideRoot) {
        // Show: [overflow menu, leaf breadcrumb]
        return [menuElement, ...visibleElements]
      } else {
        // Show: [root breadcrumb, overflow menu, leaf breadcrumb]
        return [rootElement, menuElement, ...visibleElements]
      }
    }
  }, [overflowMenuEnabled, overflow, menuItems, effectiveHideRoot, measureMenuButton, visibleItems, rootItem, children])

  return overflowMenuEnabled ? (
    <nav
      className={clsx(className, classes.BreadcrumbsBase)}
      aria-label="Breadcrumbs"
      style={style}
      ref={containerRef}
      data-overflow={overflow}
      data-variant={variant}
    >
      <BreadcrumbsList>{finalChildren}</BreadcrumbsList>
    </nav>
  ) : (
    <nav
      className={clsx(className, classes.BreadcrumbsBase)}
      aria-label="Breadcrumbs"
      style={style}
      data-variant={variant}
    >
      <BreadcrumbsList>{wrappedChildren}</BreadcrumbsList>
    </nav>
  )
}

const ItemSeparator = () => {
  return (
    <span className={classes.ItemSeparator}>
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10.956 1.27994L6.06418 14.7201L5 14.7201L9.89181 1.27994L10.956 1.27994Z" fill="currentcolor" />
      </svg>
    </span>
  )
}

type StyledBreadcrumbsItemProps = {
  to?: To
  selected?: boolean
  className?: string
  style?: React.CSSProperties
} & React.HTMLAttributes<HTMLAnchorElement> &
  React.ComponentPropsWithRef<'a'>

const BreadcrumbsItem = React.forwardRef<HTMLAnchorElement, StyledBreadcrumbsItemProps>(
  ({selected, className, ...rest}, ref) => {
    return (
      <a
        className={clsx(className, classes.Item, selected && 'selected')}
        aria-current={selected ? 'page' : undefined}
        ref={ref}
        {...rest}
      />
    )
  },
)

Breadcrumbs.displayName = 'Breadcrumbs'

BreadcrumbsItem.displayName = 'Breadcrumbs.Item'

export type BreadcrumbsItemProps = ComponentProps<typeof BreadcrumbsItem>
export default Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
export const Breadcrumb = Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `BreadcrumbsProps` type instead
 */
export type BreadcrumbProps = BreadcrumbsProps

/**
 * @deprecated Use the `BreadcrumbsItemProps` type instead
 */
export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbsItem>
