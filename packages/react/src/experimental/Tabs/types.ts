import type React from 'react'
import type {AriaAttributes, PropsWithChildren} from 'react'

/**
 * Props to be used when the Tabs component's state is controlled by the parent
 */
type ControlledTabsProps = {
  /**
   * Specify the selected tab
   */
  value: string

  /**
   * `defaultValue` can only be used in the uncontrolled variant of the component
   * If you need to use `defaultValue`, please switch to the uncontrolled variant by removing the `value` prop.
   */
  defaultValue?: never

  /**
   * Provide an optional callback that is called when the selected tab changes
   */
  onValueChange: ({value}: {value: string}) => void
}

/**
 * Props to be used when the Tabs component is managing its own state
 */
type UncontrolledTabsProps = {
  /**
   * Specify the default selected tab
   */
  defaultValue: string

  /**
   * `value` can only be used in the controlled variant of the component
   * If you need to use `value`, please switch to the controlled variant by removing the `defaultValue` prop.
   */
  value?: never

  /**
   * Provide an optional callback that is called when the selected tab changes
   */
  onValueChange?: ({value}: {value: string}) => void
}

type CommonTabsProps = {
  /**
   * Optional id used as the base for generated tab and panel ids. If omitted, a
   * unique id is generated automatically.
   */
  id?: string
}

export type TabsProps = PropsWithChildren<(ControlledTabsProps | UncontrolledTabsProps) & CommonTabsProps>

type Label = {
  'aria-label': string
}

type LabelledBy = {
  'aria-labelledby': string
}

type Labelled = Label | LabelledBy

export type TabListProps = Labelled & React.HTMLAttributes<HTMLElement>

export type TabProps = React.ComponentPropsWithoutRef<'button'> & {
  /**
   * Specify whether the tab is disabled
   */
  disabled?: boolean

  /**
   * Provide a value that uniquely identifies the tab. This should mirror the
   * value provided to the corresponding TabPanel
   */
  value: string
}

export type TabPanelProps = {
  /**
   * Provide a value that uniquely identifies the tab panel. This should mirror
   * the value set for the corresponding tab
   */
  value: string
}

export type TabsContextValue = {
  groupId: string
  selectedValue: string
  selectTab(value: string): void
}

export type TabListHookProps<T extends HTMLElement> = TabListProps & {
  /** Optional ref to use for the tablist. If none is provided, one will be generated automatically */
  ref?: React.RefObject<T>
}

export type TabListHookResult<T extends HTMLElement> = {
  /** Props to be spread onto the tablist element */
  tabListProps: {
    onKeyDown: React.KeyboardEventHandler<T>
    'aria-orientation': AriaAttributes['aria-orientation']
    'aria-label': AriaAttributes['aria-label']
    'aria-labelledby': AriaAttributes['aria-labelledby']
    ref: React.RefObject<T | null>
    role: 'tablist'
  }
}

export type TabHookResult<T extends HTMLElement> = {
  /** Props to be spread onto the tab component */
  tabProps: Pick<
    React.HTMLProps<T>,
    'aria-controls' | 'aria-disabled' | 'aria-selected' | 'id' | 'tabIndex' | 'onKeyDown' | 'onMouseDown' | 'onFocus'
  > & {
    role: 'tab'
  }
}

export type TabPanelHookResult<T extends HTMLElement> = {
  /** Props to be spread onto the tabpanel component */
  tabPanelProps: Pick<React.HTMLProps<T>, 'aria-labelledby' | 'id' | 'hidden'> & {
    /**
     * An identifier to aid in styling when this panel is selected & active
     */
    'data-selected': string | undefined
    role: 'tabpanel'
  }
}
