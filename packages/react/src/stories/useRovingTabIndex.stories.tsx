import type React from 'react'
import {useRef, useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {ChevronDownIcon, ChevronRightIcon} from '@primer/octicons-react'
import {useRovingTabIndex} from '../TreeView/useRovingTabIndex'
import classes from './useRovingTabIndex.stories.module.css'

export default {
  title: 'Hooks/useRovingTabIndex',
} as Meta

function TreeItem({
  label,
  children,
  selected,
  onSelect,
  defaultExpanded = false,
}: {
  label: string
  children?: React.ReactNode
  selected?: boolean
  onSelect?: () => void
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const hasChildren = !!children

  return (
    <li
      className={classes.TreeItem}
      role="treeitem"
      tabIndex={-1}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={selected}
      onClick={e => {
        e.stopPropagation()
        if (hasChildren) {
          setExpanded(!expanded)
        }
        onSelect?.()
      }}
      onKeyDown={e => {
        if (e.currentTarget !== e.target) return

        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onSelect?.()
        }
        if (hasChildren && e.key === 'ArrowRight' && !expanded) {
          setExpanded(true)
        }
        if (hasChildren && e.key === 'ArrowLeft' && expanded) {
          setExpanded(false)
        }
      }}
    >
      {hasChildren ? expanded ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} /> : null}
      {label}
      {hasChildren && expanded ? (
        <ul className={classes.SubTree} role="group">
          {children}
        </ul>
      ) : null}
    </li>
  )
}

export const BasicRovingTabIndex = () => {
  const [lastKey, setLastKey] = useState('none')
  const containerRef = useRef<HTMLUListElement>(null)
  const mouseDownRef = useRef(false)

  useRovingTabIndex({containerRef, mouseDownRef})

  return (
    <div className={classes.Container}>
      <div className={classes.LastKeyDisplay}>Last key pressed: {lastKey}</div>
      <p className={classes.Label}>Use Arrow keys, Home, and End to navigate the tree.</p>
      <ul
        ref={containerRef}
        role="tree"
        aria-label="Files"
        className={classes.Tree}
        onKeyDownCapture={e => setLastKey(e.key)}
      >
        <TreeItem label="src" defaultExpanded>
          <TreeItem label="components" defaultExpanded>
            <TreeItem label="Button.tsx" />
            <TreeItem label="Dialog.tsx" />
            <TreeItem label="Input.tsx" />
          </TreeItem>
          <TreeItem label="hooks">
            <TreeItem label="useFocusZone.ts" />
            <TreeItem label="useRovingTabIndex.ts" />
          </TreeItem>
          <TreeItem label="index.ts" />
        </TreeItem>
        <TreeItem label="tests">
          <TreeItem label="Button.test.tsx" />
          <TreeItem label="Dialog.test.tsx" />
        </TreeItem>
        <TreeItem label="README.md" />
      </ul>
    </div>
  )
}
