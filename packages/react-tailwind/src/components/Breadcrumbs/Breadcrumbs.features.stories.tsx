import type {Meta, StoryObj} from '@storybook/react-vite'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import React from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
import {Breadcrumbs} from './Breadcrumbs'

const meta = {
  title: 'React Tailwind/Navigation/Breadcrumbs/Features',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>
export default meta

type Story = StoryObj<typeof meta>

const items = ['Home', 'Products', 'Category', 'Subcategory', 'Item', 'Details', 'Current Page'].map((item, index) => (
  <Breadcrumbs.Item key={item} href="#" selected={index === 6}>
    {item}
  </Breadcrumbs.Item>
))
const render = (overflow: 'menu' | 'menu-with-root' | 'wrap', spacious = false) => (
  <Breadcrumbs overflow={overflow} variant={spacious ? 'spacious' : 'normal'}>
    {items}
  </Breadcrumbs>
)

export const OverflowWrap: Story = {render: () => render('wrap')}
export const OverflowMenu: Story = {
  render: () => render('menu'),
}
export const OverflowMenuOpen: Story = {
  render: () => render('menu'),
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByRole('button', {name: /more breadcrumb items/})
    await userEvent.click(trigger)
    await expect(await within(document.body).findByRole('menuitem', {name: 'Home'})).toBeVisible()
  },
}
export const OverflowMenuWithRoot: Story = {
  render: () => (
    <Breadcrumbs overflow="menu-with-root">
      <Breadcrumbs.Item href="#">github</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Teams</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Engineering</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">core-productivity</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">collaboration-workflows-flex</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        global-navigation-reviewers
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}
export const SpaciousVariantWithOverflowMenu: Story = {render: () => render('menu', true)}
export const SpaciousVariantWithOverflowWrap: Story = {render: () => render('wrap', true)}
export const TwoItemsWithOverflowMenu: Story = {
  render: () => (
    <Breadcrumbs overflow="menu">
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Current Page
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}
export const TwoItemsWithOverflowMenuWithRoot: Story = {
  render: () => (
    <Breadcrumbs overflow="menu-with-root">
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" selected>
        Current Page
      </Breadcrumbs.Item>
    </Breadcrumbs>
  ),
}

export const InteractiveChildMeasurement: Story = {
  render: () => (
    <div className="legacy-breadcrumb-host">
      <style>{'.legacy-breadcrumb-host .invisible { visibility: visible !important; opacity: 0 !important; }'}</style>
      <span className="invisible" data-testid="legacy-invisible">
        Host visibility utility
      </span>
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item as="span">
          <Button>Choose repository</Button>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#current" selected>
          Current page
        </Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
  ),
}

const RepositoryNameContext = React.createContext('repo')

function RepositoryPicker({includeHiddenLinks = false}: {includeHiddenLinks?: boolean}) {
  const name = React.useContext(RepositoryNameContext)
  const [pressed, setPressed] = React.useState(false)
  return (
    <>
      {includeHiddenLinks ? (
        <>
          <span hidden>
            <a href="#hidden-attribute">Hidden by attribute</a>
          </span>
          <span style={{display: 'none'}}>
            <a href="#hidden-style">Hidden by style</a>
          </span>
          <button type="button" aria-disabled="true">
            Unavailable
          </button>
        </>
      ) : null}
      <Breadcrumbs.Item href="#repository">{name}</Breadcrumbs.Item>
      <IconButton
        aria-label="Choose repository"
        aria-pressed={pressed}
        icon={KebabHorizontalIcon}
        onClick={() => setPressed(previous => !previous)}
        size="small"
      />
    </>
  )
}

const repositoryItems = [
  <Breadcrumbs.Item key="owner" href="#owner">
    Owner
  </Breadcrumbs.Item>,
  <RepositoryPicker key="repository" />,
]
const repositoryItemsWithHiddenLinks = [repositoryItems[0], <RepositoryPicker key="repository" includeHiddenLinks />]

function DynamicRepositoryExample({single = false, hiddenLinks = false}: {single?: boolean; hiddenLinks?: boolean}) {
  const [name, setName] = React.useState('repo')
  const [showOwner, setShowOwner] = React.useState(!single)
  const [overflow, setOverflow] = React.useState<'menu' | 'wrap'>('menu')
  const items = hiddenLinks ? repositoryItemsWithHiddenLinks : repositoryItems
  return (
    <RepositoryNameContext.Provider value={name}>
      <div data-testid="repository-breadcrumb-container" style={{width: 240}}>
        <Breadcrumbs overflow={overflow}>{showOwner ? items : items.slice(1)}</Breadcrumbs>
      </div>
      <Button onClick={() => setName('longer-repository-name')}>Use longer repository name</Button>
      <Button onClick={() => setName('repo')}>Use short repository name</Button>
      <div>
        <Button onClick={() => setName('r'.repeat(77))}>Use very long repository name</Button>
      </div>
      <div>
        <Button onClick={() => setShowOwner(previous => !previous)}>Toggle owner</Button>
      </div>
      <div>
        <Button onClick={() => setOverflow(previous => (previous === 'menu' ? 'wrap' : 'menu'))}>
          Toggle overflow mode
        </Button>
      </div>
    </RepositoryNameContext.Provider>
  )
}

export const DynamicRepository: Story = {render: () => <DynamicRepositoryExample />}
export const SingleRepository: Story = {render: () => <DynamicRepositoryExample single />}
export const FocusRecoveryHiddenTargets: Story = {render: () => <DynamicRepositoryExample hiddenLinks />}
export const ShortRepositoryTargets: Story = {
  render: () => (
    <RepositoryNameContext.Provider value="i">
      {(['normal', 'spacious'] as const).flatMap(variant =>
        (['wrap', 'menu', 'menu-with-root'] as const).map(overflow => (
          <div
            key={`${variant}-${overflow}`}
            data-testid={`${variant}-${overflow}-breadcrumb-container`}
            style={{width: 180}}
          >
            <Breadcrumbs aria-label={`${variant} ${overflow} breadcrumbs`} overflow={overflow} variant={variant}>
              {repositoryItems}
            </Breadcrumbs>
          </div>
        )),
      )}
    </RepositoryNameContext.Provider>
  ),
}
