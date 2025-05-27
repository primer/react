import {SelectPanel} from '../SelectPanel'

export function shouldAcceptCallWithNoProps() {
  return (
    <SelectPanel
      placeholderText=""
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
      placeholderText=""
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
