import React from 'react'

interface ActionList2ItemProps {
  label: string
  leadingVisual?: React.ReactNode
  trailingVisual?: React.ReactNode
  inlineDescription?: string
  blockDescription?: string
  renderLabel?: (props: ActionList2ItemProps) => JSX.Element
  link?: {
    href: string
    target?: string
    rel?: string
  }
}

interface ActionList2Props {
  showDividers?: boolean
  items: ActionList2ItemProps[]
}

const ActionList2: React.FC<ActionList2Props> = ({showDividers = false, items}) => {
  const renderLabel = (item: ActionList2ItemProps) => {
    if (item.renderLabel != null) {
      return item.renderLabel(item)
    }

    if (item.link != null)
      return (
        <a href={item.link.href} target={item.link.target} rel={item.link.rel}>
          {item.label}
        </a>
      )

    return <span>item.label</span>
  }

  return (
    <ul data-dividers={showDividers}>
      {items.map(item => (
        <li key={item.label}>
          <div>
            {item.leadingVisual && <span>{item.leadingVisual}</span>}
            {item.inlineDescription != null ||
              (item.blockDescription != null && (
                <span>
                  <div>
                    {item.inlineDescription != null && item.inlineDescription}
                    {item.blockDescription != null && item.blockDescription}
                  </div>
                </span>
              ))}
            {item.blockDescription != null && (
              <span>
                <div data-description-variant="block">{item.blockDescription}</div>
              </span>
            )}
            {item.trailingVisual && <span>{item.trailingVisual}</span>}
          </div>
          {renderLabel(item)}
        </li>
      ))}
    </ul>
  )
}

export default ActionList2
