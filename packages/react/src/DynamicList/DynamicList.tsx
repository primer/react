import {clsx} from 'clsx'
import {useEffect, useRef, useState} from 'react'
import classes from './DynamicList.module.css'

type DynamicListProps<T> = {
  items: Array<T>
  maxVisibleItems?: number
  renderItem: ({item}: {item: T}) => React.ReactNode
  renderTrigger: ({buttonRef}: {buttonRef: React.RefObject<React.ElementRef<'button'>>}) => React.ReactNode
  renderOverflow: ({items}: {items: Array<T>}) => React.ReactNode
  triggerPlacement?: TriggerPlacement
} & Omit<React.HTMLAttributes<HTMLElement>, 'children'>

type TriggerPlacement = 'leading' | 'between' | 'trailing'
type ItemVisibility = 'visible' | 'hidden'

function DynamicList<T>(props: DynamicListProps<T>) {
  const {
    className,
    items,
    maxVisibleItems = Infinity,
    renderItem,
    renderTrigger,
    renderOverflow,
    triggerPlacement = 'leading',
    ...rest
  } = props
  const [itemVisibility, setItemVisibility] = useState<Array<ItemVisibility>>([])
  const listRef = useRef<React.ElementRef<'ul'>>(null)
  const buttonRef = useRef<React.ElementRef<'button'>>(null)
  const jsxElements = items.map((item, index) => {
    return (
      <div
        key={`item-${index}`}
        data-dynamic-item=""
        data-item-visibility={itemVisibility[index]}
        data-item-position={index}
      >
        {renderItem({item})}
      </div>
    )
  })
  const allVisible = itemVisibility.every(visibility => {
    return visibility === 'visible'
  })
  const triggerElement = (
    <li key="trigger" data-dynamic-trigger="" data-item-visibility={allVisible ? 'hidden' : 'visible'}>
      {renderTrigger({
        buttonRef,
      })}
    </li>
  )
  const overflowElement = renderOverflow({
    items: items.filter((_, index) => itemVisibility[index] === 'hidden'),
  })

  useEffect(() => {
    const {current: list} = listRef
    if (!list) {
      return
    }

    function onResize() {
      const {current: list} = listRef
      if (!list) {
        return
      }

      const {current: trigger} = buttonRef
      if (!trigger) {
        return
      }

      const rect = list.getBoundingClientRect()
      const triggerRect = trigger.getBoundingClientRect()

      let availableWidth = rect.width - triggerRect.width

      const items = Array.from(list.children).filter(child => {
        return child.hasAttribute('data-dynamic-item')
      }) as Array<HTMLElement>

      items.sort((a, b) => {
        const aPositionValue = a.getAttribute('data-item-position')
        const bPositionValue = b.getAttribute('data-item-position')

        if (aPositionValue === null || bPositionValue === null) {
          return 0
        }

        const aPosition = parseInt(aPositionValue, 10)
        const bPosition = parseInt(bPositionValue, 10)

        if (Number.isNaN(aPosition) || Number.isNaN(bPosition)) {
          return 0
        }

        return aPosition - bPosition
      })

      const visibility: Array<ItemVisibility> = []

      if (triggerPlacement === 'leading') {
        let hasOverflow = false

        for (let i = items.length - 1; i >= 0; i--) {
          if (hasOverflow) {
            visibility[i] = 'hidden'
            continue
          }

          const item = items[i]
          const {width} = item.getBoundingClientRect()

          if (availableWidth - width >= 0) {
            availableWidth -= width
            visibility[i] = 'visible'
          } else {
            visibility[i] = 'hidden'
            hasOverflow = true
          }
        }
      } else if (triggerPlacement === 'between') {
        let hasOverflow = false
        let numVisibileItems = 0

        const firstItem = items[0]
        if (firstItem) {
          availableWidth -= firstItem.getBoundingClientRect().width
          visibility[0] = 'visible'
        }

        for (let i = items.length - 1; i >= 0; i--) {
          if (i === 0) {
            continue
          }

          if (hasOverflow) {
            visibility[i] = 'hidden'
            continue
          }

          const item = items[i]
          const {width} = item.getBoundingClientRect()

          if (availableWidth - width >= 0) {
            availableWidth -= width
            visibility[i] = 'visible'
            numVisibileItems++
            if (numVisibileItems >= maxVisibleItems) {
              hasOverflow = true
            }
          } else {
            visibility[i] = 'hidden'
            hasOverflow = true
          }
        }
      } else if (triggerPlacement === 'trailing') {
        let hasOverflow = false

        for (let i = 0; i < items.length; i++) {
          if (hasOverflow) {
            visibility[i] = 'hidden'
            continue
          }

          const item = items[i]
          const {width} = item.getBoundingClientRect()

          if (availableWidth - width >= 0) {
            availableWidth -= width
            visibility[i] = 'visible'
          } else {
            visibility[i] = 'hidden'
            hasOverflow = true
          }
        }
      }

      setItemVisibility(visibility)
    }

    const observer = new ResizeObserver(entries => {
      if (entries.length === 0) {
        return
      }

      window.requestAnimationFrame(() => {
        onResize()
      })
    })

    observer.observe(list)

    return () => {
      observer.disconnect()
    }
  }, [maxVisibleItems, triggerPlacement])

  return (
    <ul {...rest} ref={listRef} className={clsx(className, classes.DynamicList)}>
      {getChildrenOrder(triggerPlacement, itemVisibility, jsxElements, triggerElement)}
      {overflowElement}
    </ul>
  )
}

function getChildrenOrder(
  placement: TriggerPlacement,
  itemVisibility: Array<ItemVisibility>,
  items: Array<React.JSX.Element>,
  trigger: React.ReactNode,
): Array<React.JSX.Element | React.ReactNode> {
  if (placement === 'leading') {
    const visible = []
    const hidden = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (itemVisibility[i] === 'visible') {
        visible.push(item)
      } else {
        hidden.push(item)
      }
    }

    if (hidden.length === 0) {
      return visible
    }

    return [trigger, ...visible, ...hidden]
  }

  if (placement === 'between') {
    const visible = []
    const hidden = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (itemVisibility[i] === 'visible') {
        visible.push(item)
      } else {
        hidden.push(item)
      }
    }

    if (hidden.length === 0) {
      return visible
    }

    if (visible.length === 0) {
      return [trigger, ...hidden]
    } else if (visible.length === 1) {
      return [visible[0], trigger, ...hidden]
    } else {
      return [visible[0], trigger, ...visible.slice(1), ...hidden]
    }
  }

  const visible = []
  const hidden = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (itemVisibility[i] === 'visible') {
      visible.push(item)
    } else {
      hidden.push(item)
    }
  }

  if (hidden.length === 0) {
    return visible
  }

  const firstHiddenIndex = itemVisibility.findIndex(visibility => {
    return visibility === 'hidden'
  })

  if (firstHiddenIndex === -1) {
    return [...items, trigger]
  }

  return [...items.slice(0, firstHiddenIndex), trigger, ...items.slice(firstHiddenIndex)]
}

export {DynamicList}
export type {DynamicListProps}
