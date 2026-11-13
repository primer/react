import type React from 'react'
import {createRoot} from 'react-dom/client'
import {GearIcon} from '@primer/octicons-react'
import {ActionMenu} from '../src/components/ActionMenu/ActionMenu'
import {Button} from '../src/components/Button/Button'
import {IconButton} from '../src/components/IconButton/IconButton'
import {Tooltip} from '../src/components/Tooltip/Tooltip'

export function Example({omitControls, trigger}: {omitControls: boolean; trigger: string | null}) {
  const controlProps = omitControls ? {'aria-controls': undefined} : {}
  let menuTrigger: React.ReactNode
  if (trigger === 'button') {
    menuTrigger = <ActionMenu.Button {...controlProps}>Direct</ActionMenu.Button>
  } else if (trigger === 'primitive') {
    menuTrigger = <ActionMenu.Trigger {...controlProps}>Direct</ActionMenu.Trigger>
  } else if (trigger === 'render') {
    menuTrigger = <ActionMenu.Trigger {...controlProps} render={<Button>Direct</Button>} />
  } else if (trigger === 'icon') {
    menuTrigger = <ActionMenu.Trigger {...controlProps} render={<IconButton aria-label="Direct" icon={GearIcon} />} />
  } else if (trigger === 'tooltip') {
    menuTrigger = (
      <Tooltip>
        <Tooltip.Trigger render={<ActionMenu.Button {...controlProps}>Direct</ActionMenu.Button>} />
        <Tooltip.Content>Choose an option</Tooltip.Content>
      </Tooltip>
    )
  } else {
    throw new Error('Expected a supported fixture trigger.')
  }

  return (
    <ActionMenu>
      {menuTrigger}
      <ActionMenu.Content>
        <ActionMenu.Item>First</ActionMenu.Item>
        <ActionMenu.Item>Choice</ActionMenu.Item>
        <ActionMenu.Submenu>
          <ActionMenu.SubmenuTrigger {...controlProps}>More</ActionMenu.SubmenuTrigger>
          <ActionMenu.Content>
            <ActionMenu.Item>Nested choice</ActionMenu.Item>
          </ActionMenu.Content>
        </ActionMenu.Submenu>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

function mountExample() {
  const root = document.getElementById('root')
  if (!root) throw new Error('ActionMenu fixture root not found')
  const params = new URLSearchParams(window.location.search)
  createRoot(root).render(<Example omitControls={params.get('omit') === 'true'} trigger={params.get('trigger')} />)
}

mountExample()
