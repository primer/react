import {ChevronRightIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import React from 'react'
import {ButtonBase} from '../Button/ButtonBase'
import {useControllableState} from '../hooks/useControllableState'
import {useId} from '../hooks/useId'
import classes from './Accordion.module.css'

interface AccordionItemContextValue {
  readonly disabled: boolean
  readonly expanded: boolean
  readonly headingId: string
  readonly panelId: string
  readonly toggle: () => void
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null)

function useAccordionItemContext(componentName: string): AccordionItemContextValue {
  const context = React.useContext(AccordionItemContext)

  if (context === null) {
    throw new Error(`${componentName} must be rendered within an Accordion.Item.`)
  }

  return context
}

export interface AccordionProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode
}

const Root = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {children, className, ...rest},
  forwardedRef,
) {
  return (
    <div ref={forwardedRef} className={clsx(classes.Accordion, className)} {...rest} data-component="Accordion">
      {children}
    </div>
  )
})

Root.displayName = 'Accordion'

export interface AccordionItemProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode
  /**
   * Whether the item is expanded. Providing this prop makes the item controlled.
   */
  expanded?: boolean
  /**
   * Whether the item is expanded when it is initially rendered.
   */
  defaultExpanded?: boolean
  /**
   * Whether the item cannot be expanded or collapsed.
   */
  disabled?: boolean
  /**
   * Called when the item requests a change to its expanded state.
   */
  onExpandedChange?: (event: {expanded: boolean}) => void
}

const Item = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  {
    children,
    className,
    defaultExpanded = false,
    disabled = false,
    expanded: controlledExpanded,
    onExpandedChange,
    ...rest
  },
  forwardedRef,
) {
  const [expanded, setExpanded] = useControllableState({
    name: 'Accordion.Item',
    value: controlledExpanded,
    defaultValue: defaultExpanded,
    onChange: value => onExpandedChange?.({expanded: value}),
  })
  const id = useId()
  const toggle = React.useCallback(() => {
    if (!disabled) {
      setExpanded(value => !value)
    }
  }, [disabled, setExpanded])
  const context = React.useMemo(
    () => ({
      disabled,
      expanded,
      headingId: `${id}-heading`,
      panelId: `${id}-panel`,
      toggle,
    }),
    [disabled, expanded, id, toggle],
  )

  return (
    <AccordionItemContext.Provider value={context}>
      <div
        ref={forwardedRef}
        className={clsx(classes.Item, className)}
        {...rest}
        data-component="Accordion.Item"
        data-expanded={expanded ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
})

Item.displayName = 'Accordion.Item'

export interface AccordionHeadingProps extends React.ComponentPropsWithoutRef<'h2'> {
  /**
   * The label for the accordion trigger.
   */
  children: React.ReactNode
  /**
   * The heading level to render.
   */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const Heading = React.forwardRef<HTMLHeadingElement, AccordionHeadingProps>(function AccordionHeading(
  {as: Component = 'h2', children, className, ...rest},
  forwardedRef,
) {
  const {disabled, expanded, headingId, panelId, toggle} = useAccordionItemContext('Accordion.Heading')

  return (
    <Component
      ref={forwardedRef}
      className={clsx(classes.Heading, className)}
      {...rest}
      data-component="Accordion.Heading"
    >
      <ButtonBase
        as="button"
        aria-controls={panelId}
        aria-expanded={expanded}
        block
        className={classes.Trigger}
        disabled={disabled}
        id={headingId}
        labelWrap
        onClick={toggle}
        trailingVisual={<ChevronRightIcon aria-hidden="true" className={classes.Icon} />}
        type="button"
        variant="invisible"
      >
        {children}
      </ButtonBase>
    </Component>
  )
})

Heading.displayName = 'Accordion.Heading'

export interface AccordionPanelProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode
}

const Panel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(function AccordionPanel(
  {children, className, ...rest},
  forwardedRef,
) {
  const {expanded, headingId, panelId} = useAccordionItemContext('Accordion.Panel')

  return (
    <div
      ref={forwardedRef}
      className={clsx(classes.Panel, className)}
      {...rest}
      aria-labelledby={headingId}
      data-component="Accordion.Panel"
      hidden={!expanded}
      id={panelId}
    >
      {children}
    </div>
  )
})

Panel.displayName = 'Accordion.Panel'

export const Accordion = Object.assign(Root, {
  Item,
  Heading,
  Panel,
})
