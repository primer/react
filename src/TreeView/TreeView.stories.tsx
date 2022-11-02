import {DiffAddedIcon, DiffModifiedIcon, DiffRemovedIcon, DiffRenamedIcon, FileIcon} from '@primer/octicons-react'
import {Meta, Story} from '@storybook/react'
import React from 'react'
import Box from '../Box'
import {Button} from '../Button'
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
    <nav aria-label="Files">
      <TreeView aria-label="Files">
        <TreeView.LinkItem href="#src" defaultExpanded>
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
      <nav aria-label="Files">
        <TreeView aria-label="Files">
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
                <TreeView.TrailingVisual label="added">
                  <StyledOcticon icon={DiffAddedIcon} color="success.fg" />
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
                    <TreeView.TrailingVisual label="modified">
                      <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" />
                    </TreeView.TrailingVisual>
                  </TreeView.LinkItem>
                  <TreeView.LinkItem href="#button-test-tsx">
                    <TreeView.LeadingVisual>
                      <FileIcon />
                    </TreeView.LeadingVisual>
                    Button.test.tsx
                    <TreeView.TrailingVisual label="modified">
                      <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" />
                    </TreeView.TrailingVisual>
                  </TreeView.LinkItem>
                </TreeView.SubTree>
              </TreeView.Item>
              <TreeView.Item>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                ReallyLongFileNameThatShouldBeTruncated.tsx
                <TreeView.TrailingVisual label="modified">
                  <StyledOcticon icon={DiffModifiedIcon} color="attention.fg" />
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
                <TreeView.TrailingVisual label="renamed">
                  <StyledOcticon icon={DiffRenamedIcon} />
                </TreeView.TrailingVisual>
              </TreeView.LinkItem>
              <TreeView.LinkItem href="#favicon-ico">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                favicon.ico
                <TreeView.TrailingVisual label="removed">
                  <StyledOcticon icon={DiffRemovedIcon} color="danger.fg" />
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

const TREE: TreeItem[] = Array.from({length: 5}).map((_, i) => ({
  data: {
    name: `Item ${i}`,
    expanded: false
  },
  children: Array.from({length: 5}).map((_, j) => ({
    data: {
      name: `Item ${i}.${j}`,
      expanded: false
    },
    children: Array.from({length: 5}).map((_, k) => ({
      data: {
        name: `Item ${i}.${j}.${k}`,
        expanded: false
      },
      children: []
    }))
  }))
}))

export const Controlled: Story = () => {
  const [currentPath, setCurrentPath] = React.useState<string[]>(['src', 'Avatar.tsx'])
  const [tree, setTree] = React.useState<TreeItem[]>(TREE)

  return (
    <Box sx={{p: 3, display: 'grid', gap: 3}}>
      <Box sx={{display: 'flex', gap: 2}}>
        <Button onClick={() => setTree(collapseAll)}>Collapse all</Button>
        <Button onClick={() => setTree(expandAll)}>Expand all</Button>
      </Box>
      <nav aria-label="Files">
        <CurrentPathContext.Provider value={{currentPath, setCurrentPath}}>
          <TreeView aria-label="Files">
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
      <nav aria-label="Files">
        <TreeView aria-label="Files">
          <TreeView.Item>
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Some file
          </TreeView.Item>
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
          <TreeView.Item>
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Another file
          </TreeView.Item>
        </TreeView>
      </nav>
    </Box>
  )
}

AsyncSuccess.args = {
  responseTime: 2000
}

export const AsyncWithCount: Story = args => {
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
      <nav aria-label="Files">
        <TreeView aria-label="Files">
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
            <TreeView.SubTree state={state} count={args.count}>
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
        </TreeView>
      </nav>
    </Box>
  )
}

AsyncWithCount.args = {
  responseTime: 2000,
  count: 3
}

AsyncWithCount.argTypes = {
  count: {
    type: 'number'
  }
}

async function alwaysFails(responseTime: number) {
  await wait(responseTime)
  throw new Error('Failed to load items')
  return []
}

export const AsyncError: Story = args => {
  const [isLoading, setIsLoading] = React.useState(false)
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
      <nav aria-label="Files">
        <TreeView aria-label="Files">
          <TreeView.Item>
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Some file
          </TreeView.Item>
          <TreeView.Item
            onExpandedChange={isExpanded => {
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
                <TreeView.ErrorDialog
                  onRetry={() => {
                    setError(null)
                    loadItems()
                  }}
                  onDismiss={() => {
                    setError(null)
                  }}
                >
                  {error.message}
                </TreeView.ErrorDialog>
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
          <TreeView.Item>
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Another file
          </TreeView.Item>
        </TreeView>
      </nav>
    </Box>
  )
}

AsyncError.args = {
  responseTime: 2000
}

export const StressTest: Story = () => {
  return (
    <Box sx={{p: 3, maxWidth: 400}}>
      <TreeView aria-label="Files">
        {Array.from({length: 1000}).map((_, index) => (
          <TreeView.Item key={index}>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            Directory {index}
            <TreeView.SubTree>
              {Array.from({length: 100}).map((_, index) => (
                <TreeView.Item key={index}>
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  File {index}
                </TreeView.Item>
              ))}
            </TreeView.SubTree>
          </TreeView.Item>
        ))}
      </TreeView>
    </Box>
  )
}

export const EmptyDirectory: Story = () => {
  const [state, setState] = React.useState<SubTreeState>('loading')
  const timeoutId = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
    }
  }, [])

  return (
    <Box sx={{p: 3, maxWidth: 400}}>
      <TreeView aria-label="Test">
        <TreeView.Item
          onExpandedChange={expanded => {
            if (expanded) {
              timeoutId.current = setTimeout(() => {
                setState('done')
                timeoutId.current = null
              }, 2000)
            }
          }}
        >
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          src
          <TreeView.SubTree state={state} />
        </TreeView.Item>
        <TreeView.Item>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          .github
          <TreeView.SubTree />
        </TreeView.Item>
      </TreeView>
    </Box>
  )
}

export const NestedScrollContainer: Story = () => {
  return (
    <Box sx={{p: 3, maxWidth: 400, maxHeight: '50vh', overflow: 'auto'}}>
      <TreeView aria-label="Files">
        {Array.from({length: 100}).map((_, i) => (
          <TreeView.Item key={i}>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            Directory {i}
            <TreeView.SubTree>
              {Array.from({length: 10}).map((_, j) => (
                // eslint-disable-next-line no-console
                <TreeView.Item key={j} onSelect={() => console.log(`Directory ${i}/File ${j}`)}>
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  File {j}
                </TreeView.Item>
              ))}
            </TreeView.SubTree>
          </TreeView.Item>
        ))}
      </TreeView>
    </Box>
  )
}

export default meta
