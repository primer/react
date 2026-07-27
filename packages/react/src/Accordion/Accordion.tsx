import {ChevronDownIcon} from '@primer/octicons-react'
import {clsx} from 'clsx'
import React from 'react'
import {useControllableState} from '../hooks/useControllableState'
import {useMergedRefs} from '../hooks/useMergedRefs'
import {useId} from '../hooks/useId'
import {useDevOnlyEffect} from '../internal/hooks/useDevOnlyEffect'
import {warning} from '../utils/warning'
import classes from './Accordion.module.css'

interface PrimerOwnedProps {
  'data-component'?: never
}

interface AccordionItemContextValue {
  expanded: boolean
  panelCount: number
  panelId: string
  registerPanel: (element: HTMLDivElement) => void
  registerTrigger: (element: HTMLButtonElement) => void
  toggleExpanded: () => void
  triggerCount: number
  triggerId: string
  unregisterPanel: (element: HTMLDivElement) => void
  unregisterTrigger: (element: HTMLButtonElement) => void
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | undefined>(undefined)

function useAccordionItemContext(componentName: string): AccordionItemContextValue {
  const context = React.useContext(AccordionItemContext)

  if (context === undefined) {
    throw new Error(`${componentName} must be rendered within an AccordionItem.`)
  }

  return context
}

function useAccordionItem({
  defaultExpanded,
  expanded: controlledExpanded,
  onExpandedChange,
}: Pick<AccordionItemProps, 'defaultExpanded' | 'expanded' | 'onExpandedChange'>): AccordionItemContextValue {
  const id = useId()
  const panels = React.useRef(new Set<HTMLDivElement>())
  const triggers = React.useRef(new Set<HTMLButtonElement>())
  const [panelCount, setPanelCount] = React.useState(0)
  const [triggerCount, setTriggerCount] = React.useState(0)
  const [expanded, setExpanded] = useControllableState({
    name: 'AccordionItem',
    value: controlledExpanded,
    defaultValue: defaultExpanded ?? false,
    onChange: expanded => onExpandedChange?.({expanded}),
  })
  const toggleExpanded = React.useCallback(() => {
    setExpanded(currentExpanded => !currentExpanded)
  }, [setExpanded])
  const registerPanel = React.useCallback((element: HTMLDivElement) => {
    panels.current.add(element)
    setPanelCount(panels.current.size)
  }, [])
  const unregisterPanel = React.useCallback((element: HTMLDivElement) => {
    panels.current.delete(element)
    setPanelCount(panels.current.size)
  }, [])
  const registerTrigger = React.useCallback((element: HTMLButtonElement) => {
    triggers.current.add(element)
    setTriggerCount(triggers.current.size)
  }, [])
  const unregisterTrigger = React.useCallback((element: HTMLButtonElement) => {
    triggers.current.delete(element)
    setTriggerCount(triggers.current.size)
  }, [])

  return {
    expanded,
    panelCount,
    panelId: `${id}-panel`,
    registerPanel,
    registerTrigger,
    toggleExpanded,
    triggerCount,
    triggerId: `${id}-trigger`,
    unregisterPanel,
    unregisterTrigger,
  }
}

export interface AccordionRootProps extends React.ComponentPropsWithoutRef<'div'>, PrimerOwnedProps {}

export const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(function AccordionRoot(
  {children, className, ...rest},
  forwardedRef,
) {
  return (
    <div {...rest} className={clsx(classes.Accordion, className)} data-component="Accordion" ref={forwardedRef}>
      {children}
    </div>
  )
})

interface AccordionItemBaseProps extends React.ComponentPropsWithoutRef<'div'>, PrimerOwnedProps {}

interface ControlledAccordionItemProps {
  defaultExpanded?: never
  expanded: boolean
  onExpandedChange({expanded}: {expanded: boolean}): void
}

interface UncontrolledAccordionItemProps {
  defaultExpanded?: boolean
  expanded?: never
  onExpandedChange?: ({expanded}: {expanded: boolean}) => void
}

export type AccordionItemProps = AccordionItemBaseProps &
  (ControlledAccordionItemProps | UncontrolledAccordionItemProps)

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  {children, className, defaultExpanded, expanded: controlledExpanded, onExpandedChange, ...rest},
  forwardedRef,
) {
  const itemRef = React.useRef<HTMLDivElement>(null)
  const mergedRef = useMergedRefs(forwardedRef, itemRef)
  const context = useAccordionItem({defaultExpanded, expanded: controlledExpanded, onExpandedChange})

  useDevOnlyEffect(() => {
    const item = itemRef.current
    if (!item) return

    const selector = '[data-component="Accordion.Item"]'
    const ownedTriggers = Array.from(item.querySelectorAll('[data-component="Accordion.Trigger"]')).filter(
      element => element.closest(selector) === item,
    )
    const ownedPanels = Array.from(item.querySelectorAll('[data-component="Accordion.Panel"]')).filter(
      element => element.closest(selector) === item,
    )

    warning(ownedTriggers.length === 0, 'AccordionItem: Render one AccordionTrigger.')
    warning(ownedTriggers.length > 1, 'AccordionItem: Render only one AccordionTrigger.')
    warning(ownedPanels.length === 0, 'AccordionItem: Render one AccordionPanel.')
    warning(ownedPanels.length > 1, 'AccordionItem: Render only one AccordionPanel.')
    warning(
      ownedTriggers.some(trigger => !trigger.parentElement?.matches('h2, h3, h4, h5, h6')),
      'AccordionItem: AccordionTrigger must be a direct child of a heading element.',
    )
    warning(
      ownedTriggers.some(
        trigger =>
          !trigger.textContent.trim() &&
          !trigger.getAttribute('aria-label')?.trim() &&
          !trigger.getAttribute('aria-labelledby')?.trim(),
      ),
      'AccordionItem: AccordionTrigger must have an accessible name.',
    )
  }, [children])

  return (
    <AccordionItemContext.Provider value={context}>
      <div
        {...rest}
        className={clsx(classes.Item, className)}
        data-component="Accordion.Item"
        data-expanded={context.expanded ? '' : undefined}
        ref={mergedRef}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
})

type HeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface AccordionHeadingProps extends React.ComponentPropsWithoutRef<'h3'>, PrimerOwnedProps {
  as?: HeadingLevel
}

export const AccordionHeading = React.forwardRef<HTMLHeadingElement, AccordionHeadingProps>(function AccordionHeading(
  {as: Heading = 'h3', children, className, ...rest},
  forwardedRef,
) {
  useAccordionItemContext('AccordionHeading')

  return (
    <Heading
      {...rest}
      className={clsx(classes.Heading, className)}
      data-component="Accordion.Heading"
      ref={forwardedRef}
    >
      {children}
    </Heading>
  )
})

export interface AccordionTriggerProps
  extends Omit<
      React.ComponentPropsWithoutRef<'button'>,
      'aria-controls' | 'aria-expanded' | 'data-component' | 'id' | 'type'
    >,
    PrimerOwnedProps {}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger(
  {children, className, disabled, onClick, ...rest},
  forwardedRef,
) {
  const {expanded, panelCount, panelId, registerTrigger, toggleExpanded, triggerId, unregisterTrigger} =
    useAccordionItemContext('AccordionTrigger')
  const registeredElement = React.useRef<HTMLButtonElement | null>(null)
  const registrationRef = React.useCallback(
    (element: HTMLButtonElement | null) => {
      if (registeredElement.current) {
        unregisterTrigger(registeredElement.current)
      }
      registeredElement.current = element
      if (element) {
        registerTrigger(element)
      }
    },
    [registerTrigger, unregisterTrigger],
  )
  const mergedRef = useMergedRefs(forwardedRef, registrationRef)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)

    if (!event.defaultPrevented && !disabled) {
      toggleExpanded()
    }
  }

  return (
    <button
      {...rest}
      aria-controls={panelCount > 0 ? panelId : undefined}
      aria-expanded={expanded}
      className={clsx(classes.Trigger, className)}
      data-component="Accordion.Trigger"
      data-expanded={expanded ? '' : undefined}
      disabled={disabled}
      id={triggerId}
      onClick={handleClick}
      ref={mergedRef}
      type="button"
    >
      <span className={classes.TriggerContent}>{children}</span>
      <ChevronDownIcon aria-hidden="true" className={classes.Chevron} />
    </button>
  )
})

export interface AccordionPanelProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'aria-labelledby' | 'data-component' | 'hidden' | 'id' | 'role'>,
    PrimerOwnedProps {
  role?: 'region'
}

export const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(function AccordionPanel(
  {children, className, role, ...rest},
  forwardedRef,
) {
  const {expanded, panelId, registerPanel, triggerCount, triggerId, unregisterPanel} =
    useAccordionItemContext('AccordionPanel')
  const registeredElement = React.useRef<HTMLDivElement | null>(null)
  const registrationRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      if (registeredElement.current) {
        unregisterPanel(registeredElement.current)
      }
      registeredElement.current = element
      if (element) {
        registerPanel(element)
      }
    },
    [registerPanel, unregisterPanel],
  )
  const mergedRef = useMergedRefs(forwardedRef, registrationRef)

  return (
    <div
      {...rest}
      aria-labelledby={role === 'region' && triggerCount > 0 ? triggerId : undefined}
      className={clsx(classes.Panel, className)}
      data-component="Accordion.Panel"
      data-expanded={expanded ? '' : undefined}
      hidden={!expanded}
      id={panelId}
      ref={mergedRef}
      role={role}
    >
      {children}
    </div>
  )
})
