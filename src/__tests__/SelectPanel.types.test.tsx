import React from 'react'
import {SelectPanel} from '../SelectPanel'

export function shouldAcceptCallWithNoProps() {
  return (
    <SelectPanel
      title=""
      inputLabel=""
      open={false}
      onOpenChange={() => null}
      items={[]}
      selected={[]}
      onSelectedChange={() => null}
      onFilterChange={() => null}
    />
  )
}

export function shouldAcceptDOMPropsOnOverlay() {
  return (
    <SelectPanel
      title=""
      inputLabel=""
      open={false}
      onOpenChange={() => null}
      items={[]}
      selected={[]}
      onSelectedChange={() => null}
      onFilterChange={() => null}
      overlayProps={{onMouseDown: () => null}}
    />
  )
}
