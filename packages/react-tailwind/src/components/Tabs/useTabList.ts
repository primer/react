import {type Tabs as BaseTabs} from '@base-ui/react/tabs'
import React from 'react'

export type TabListHookProps = React.ComponentPropsWithoutRef<typeof BaseTabs.List>

/**
 * Returns props for a Base UI tab list.
 *
 * Base UI owns tab keyboard behavior; this hook deliberately only provides a
 * stable composition boundary for consumers building a custom presentation.
 */
export function useTabList(props: TabListHookProps = {}) {
  return React.useMemo(() => ({tabListProps: props}), [props])
}
