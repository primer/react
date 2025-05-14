import {ActionList} from '../../deprecated/ActionList'

export function emptyList() {
  return <ActionList items={[]} />
}

export function listWithSingleItem() {
  return <ActionList items={[{text: 'One'}]} />
}

export function canUseDivDOMProps() {
  return (
    <ActionList
      items={[
        {
          text: 'One',
          onMouseDown: () => undefined,
        },
      ]}
    />
  )
}

export function cannotUseAnchorDOMProps() {
  return (
    <ActionList
      items={[
        {
          text: 'One',
          // @ts-expect-error href is not a div DOM prop
          href: '#',
        },
      ]}
    />
  )
}

export function cannotUseAsWithoutRenderProp() {
  return (
    <ActionList
      items={[
        {
          text: 'One',
          // @ts-expect-error as is only available via manual rendering of items
          as: 'a',
        },
      ]}
    />
  )
}
