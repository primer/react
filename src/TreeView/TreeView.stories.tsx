import {DiffAddedIcon, DiffModifiedIcon, DiffRemovedIcon, DiffRenamedIcon, FileIcon} from '@primer/octicons-react'
import {Meta, Story} from '@storybook/react'
import React from 'react'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import Box from '../Box'
import {Button} from '../Button'
import {ConfirmationDialog} from '../Dialog/ConfirmationDialog'
import StyledOcticon from '../StyledOcticon'
import {SubTreeState, TreeView} from './TreeView'

const meta: Meta = {
  title: 'Components/TreeView',
  component: TreeView,
  parameters: {
    layout: 'fullscreen'
  }
}

export const FileTreeWithDirectoryLinks: Story = () => (
  <Box sx={{p: 3, maxWidth: 400}}>
    <nav aria-label="File navigation">
      <TreeView aria-label="File navigation">
        <TreeView.LinkItem href="#src">
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          src
          <TreeView.SubTree>
            <TreeView.LinkItem href="#avatar-tsx">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              Avatar.tsx
            </TreeView.LinkItem>
            <TreeView.LinkItem href="#button" current>
              <TreeView.LeadingVisual>
                <TreeView.DirectoryIcon />
              </TreeView.LeadingVisual>
              Button
              <TreeView.SubTree>
                <TreeView.LinkItem href="#button-tsx">
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  Button.tsx
                </TreeView.LinkItem>
                <TreeView.LinkItem href="#button-test-tsx">
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  Button.test.tsx
                </TreeView.LinkItem>
              </TreeView.SubTree>
            </TreeView.LinkItem>
            <TreeView.Item>
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              ReallyLongFileNameThatShouldBeTruncated.tsx
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.LinkItem>
        <TreeView.LinkItem
          href="#public"
          // eslint-disable-next-line no-console
          onExpandedChange={isExpanded => console.log(`${isExpanded ? 'Expanded' : 'Collapsed'} "public" folder `)}
        >
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          public
          <TreeView.SubTree>
            <TreeView.LinkItem href="#index-html">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              index.html
            </TreeView.LinkItem>
            <TreeView.LinkItem href="#favicon-ico">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              favicon.ico
            </TreeView.LinkItem>
          </TreeView.SubTree>
        </TreeView.LinkItem>
        <TreeView.LinkItem href="#package-json">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          package.json
        </TreeView.LinkItem>
      </TreeView>
    </nav>
  </Box>
)

export const FileTreeWithoutDirectoryLinks: Story = () => {
  return (
    <Box sx={{p: 3, maxWidth: 400}}>
      <nav aria-label="File navigation">
        <TreeView aria-label="File navigation">
          <TreeView.Item defaultExpanded>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            src
            <TreeView.SubTree>
              <TreeView.LinkItem href="#avatar-tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Avatar.tsx
                <TreeView.TrailingVisual>
                  <StyledOcticon icon={DiffAddedIcon} color="success.fg" aria-label="added" />
                </TreeView.TrailingVisual>
              </TreeView.LinkItem>
              <TreeView.Item defaultExpanded>
                <TreeView.LeadingVisual>
                  <TreeView.DirectoryIcon />
                </TreeView.LeadingVisual>
                Button
                <TreeView.SubTree>
                  <TreeView.LinkItem href="#button-tsx" current>
                    <TreeView.LeadingVisual>
                      <FileIcon />
                    </TreeView.LeadingVisual>
                    Button.tsx
                    <TreeView.TrailingVisual>
                      <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" aria-label="modified" />
                    </TreeView.TrailingVisual>
                  </TreeView.LinkItem>
                  <TreeView.LinkItem href="#button-test-tsx">
                    <TreeView.LeadingVisual>
                      <FileIcon />
                    </TreeView.LeadingVisual>
                    Button.test.tsx
                    <TreeView.TrailingVisual>
                      <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" aria-label="modified" />
                    </TreeView.TrailingVisual>
                  </TreeView.LinkItem>
                </TreeView.SubTree>
              </TreeView.Item>
              <TreeView.Item>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                ReallyLongFileNameThatShouldBeTruncated.tsx
                <TreeView.TrailingVisual>
                  <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" aria-label="modified" />
                </TreeView.TrailingVisual>
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item defaultExpanded>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            public
            <TreeView.SubTree>
              <TreeView.LinkItem href="#index-html">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                index.html
                <TreeView.TrailingVisual>
                  <StyledOcticon icon={DiffRenamedIcon} aria-label="renamed" />
                </TreeView.TrailingVisual>
              </TreeView.LinkItem>
              <TreeView.LinkItem href="#favicon-ico">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                favicon.ico
                <TreeView.TrailingVisual>
                  <StyledOcticon icon={DiffRemovedIcon} color="danger.fg" aria-label="removed" />
                </TreeView.TrailingVisual>
              </TreeView.LinkItem>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      </nav>
    </Box>
  )
}

type TreeItem = {
  data: {
    name: string
    expanded: boolean
  }
  children: TreeItem[]
}

function expandAll(tree: TreeItem[]): TreeItem[] {
  return tree.map(item => ({
    data: {
      ...item.data,
      expanded: true
    },
    children: expandAll(item.children)
  }))
}

function collapseAll(tree: TreeItem[]): TreeItem[] {
  return tree.map(item => ({
    data: {
      ...item.data,
      expanded: false
    },
    children: collapseAll(item.children)
  }))
}

function setExpanded(tree: TreeItem[], path: string[], expanded: boolean): TreeItem[] {
  return tree.map(item => {
    if (item.data.name === path[0] && path.length === 1) {
      return {
        ...item,
        data: {
          ...item.data,
          expanded
        }
      }
    } else if (item.data.name === path[0]) {
      return {
        ...item,
        children: setExpanded(item.children, path.slice(1), expanded)
      }
    } else {
      return item
    }
  })
}

const CurrentPathContext = React.createContext<{
  currentPath: string[]
  setCurrentPath: React.Dispatch<React.SetStateAction<string[]>>
}>({
  currentPath: [],
  setCurrentPath: () => {}
})

export const Controlled: Story = () => {
  const [currentPath, setCurrentPath] = React.useState<string[]>(['src', 'Avatar.tsx'])
  const [tree, setTree] = React.useState<TreeItem[]>([
    {
      data: {
        name: 'src',
        expanded: false
      },
      children: [
        {
          data: {
            name: 'Avatar.tsx',
            expanded: false
          },
          children: []
        },
        {
          data: {
            name: 'Button',
            expanded: false
          },
          children: [
            {
              data: {
                name: 'Button.tsx',
                expanded: false
              },
              children: []
            },
            {
              data: {
                name: 'Button.test.tsx',
                expanded: false
              },
              children: []
            }
          ]
        }
      ]
    },
    {
      data: {
        name: 'public',
        expanded: false
      },
      children: [
        {
          data: {
            name: 'index.html',
            expanded: false
          },
          children: []
        },
        {
          data: {
            name: 'favicon.ico',
            expanded: false
          },
          children: []
        }
      ]
    },
    {
      data: {
        name: 'package.json',
        expanded: false
      },
      children: []
    }
  ])

  return (
    <Box sx={{p: 3, display: 'grid', gap: 3}}>
      <Box sx={{display: 'flex', gap: 2}}>
        <Button onClick={() => setTree(collapseAll)}>Collapse all</Button>
        <Button onClick={() => setTree(expandAll)}>Expand all</Button>
        <ActionMenu>
          <ActionMenu.Button>Jump to</ActionMenu.Button>

          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item onSelect={() => setCurrentPath(['src'])}>src</ActionList.Item>
              <ActionList.Item onSelect={() => setCurrentPath(['src', 'Avatar.tsx'])}>src/Avatar.tsx</ActionList.Item>
              <ActionList.Item onSelect={() => setCurrentPath(['src', 'Button'])}>src/Button</ActionList.Item>
              <ActionList.Item onSelect={() => setCurrentPath(['src', 'Button', 'Button.tsx'])}>
                src/Button/Button.tsx
              </ActionList.Item>
              <ActionList.Item onSelect={() => setCurrentPath(['src', 'Button', 'Button.test.tsx'])}>
                src/Button/Button.test.tsx
              </ActionList.Item>
              <ActionList.Item onSelect={() => setCurrentPath(['public'])}>public</ActionList.Item>
              <ActionList.Item onSelect={() => setCurrentPath(['public', 'index.html'])}>
                public/index.html
              </ActionList.Item>
              <ActionList.Item onSelect={() => setCurrentPath(['public', 'favicon.ico'])}>
                public/favicon.ico
              </ActionList.Item>
              <ActionList.Item onSelect={() => setCurrentPath(['package.json'])}>package.json</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Box>
      <nav aria-label="File navigation">
        <CurrentPathContext.Provider value={{currentPath, setCurrentPath}}>
          <TreeView aria-label="File navigation">
            {tree.map(item => (
              <TreeItem
                key={item.data.name}
                item={item}
                path={[item.data.name]}
                onExpandedChange={(path, expanded) => setTree(tree => setExpanded(tree, path, expanded))}
              />
            ))}
          </TreeView>
        </CurrentPathContext.Provider>
      </nav>
    </Box>
  )
}

function TreeItem({
  item,
  path,
  onExpandedChange
}: {
  item: TreeItem
  path: string[]
  onExpandedChange: (path: string[], expanded: boolean) => void
}) {
  const {currentPath, setCurrentPath} = React.useContext(CurrentPathContext)
  return (
    <TreeView.Item
      current={currentPath.join('/') === path.join('/')}
      expanded={item.data.expanded}
      onExpandedChange={expanded => onExpandedChange(path, expanded)}
      onSelect={() => setCurrentPath(path)}
    >
      {item.data.name}
      {item.children.length > 0 ? (
        <TreeView.SubTree>
          {item.children.map(child => (
            <TreeItem
              key={child.data.name}
              item={child}
              path={path.concat(child.data.name)}
              onExpandedChange={onExpandedChange}
            />
          ))}
        </TreeView.SubTree>
      ) : null}
    </TreeView.Item>
  )
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function loadItems(responseTime: number) {
  await wait(responseTime)
  return ['Avatar.tsx', 'Button.tsx', 'Checkbox.tsx']
}

export const AsyncSuccess: Story = args => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [asyncItems, setAsyncItems] = React.useState<string[]>([])

  let state: SubTreeState = 'initial'

  if (isLoading) {
    state = 'loading'
  } else if (asyncItems.length > 0) {
    state = 'done'
  }

  return (
    <Box sx={{p: 3}}>
      <nav aria-label="File navigation">
        <TreeView aria-label="File navigation">
          <TreeView.Item
            onExpandedChange={async isExpanded => {
              if (asyncItems.length === 0 && isExpanded) {
                setIsLoading(true)

                // Load items
                const items = await loadItems(args.responseTime)

                setIsLoading(false)
                setAsyncItems(items)
              }
            }}
          >
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            Directory with async items
            <TreeView.SubTree state={state}>
              {asyncItems.map(item => (
                <TreeView.Item key={item}>
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  {item}
                </TreeView.Item>
              ))}
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      </nav>
    </Box>
  )
}

AsyncSuccess.args = {
  responseTime: 2000
}

async function alwaysFails(responseTime: number) {
  await wait(responseTime)
  throw new Error('Failed to load items')
  return []
}

export const AsyncError: Story = args => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [asyncItems, setAsyncItems] = React.useState<string[]>([])
  const [error, setError] = React.useState<Error | null>(null)

  let state: SubTreeState = 'initial'

  if (isLoading) {
    state = 'loading'
  } else if (error) {
    state = 'error'
  } else if (asyncItems.length > 0) {
    state = 'done'
  }

  async function loadItems() {
    if (asyncItems.length === 0) {
      setIsLoading(true)

      try {
        // Try to load items
        const items = await alwaysFails(args.responseTime)
        setAsyncItems(items)
      } catch (error) {
        setError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Box sx={{p: 3}}>
      <nav aria-label="File navigation">
        <TreeView aria-label="File navigation">
          <TreeView.Item
            expanded={isExpanded}
            onExpandedChange={isExpanded => {
              setIsExpanded(isExpanded)

              if (isExpanded) {
                loadItems()
              }
            }}
          >
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            Directory with async items
            <TreeView.SubTree state={state}>
              {error ? (
                <ConfirmationDialog
                  title="Error"
                  onClose={gesture => {
                    setError(null)

                    if (gesture === 'confirm') {
                      loadItems()
                    } else {
                      setIsExpanded(false)
                    }
                  }}
                  confirmButtonContent="Retry"
                >
                  {error.message}
                </ConfirmationDialog>
              ) : null}
              {asyncItems.map(item => (
                <TreeView.Item key={item}>
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  {item}
                </TreeView.Item>
              ))}
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      </nav>
    </Box>
  )
}

AsyncError.args = {
  responseTime: 2000
}

export default meta
