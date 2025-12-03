import {
  DiffAddedIcon,
  DiffModifiedIcon,
  DiffRemovedIcon,
  DiffRenamedIcon,
  FileIcon,
  KebabHorizontalIcon,
} from '@primer/octicons-react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import React from 'react'
import {Button, IconButton} from '../Button'
import Octicon from '../Octicon'
import type {SubTreeState} from './TreeView'
import {TreeView} from './TreeView'
import classes from './TreeView.features.stories.module.css'

const meta: Meta = {
  title: 'Components/TreeView/Features',
  component: TreeView,
  decorators: [
    Story => {
      return (
        // Prevent TreeView from expanding to the full width of the screen
        <div className={classes.StorybookDecorator}>
          <Story />
        </div>
      )
    },
  ],
}

export const Files: StoryFn = () => (
  <nav aria-label="Files">
    <TreeView aria-label="Files" truncate={false}>
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
          </TreeView.Item>
          <TreeView.Item id="src/Button" current>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            Button
            <TreeView.SubTree>
              <TreeView.Item id="src/Button/Button.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button.test.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button.test.tsx
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="src/ReallyLongFileNameThatShouldBeTruncated.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            ReallyLongFileNameThatShouldBeTruncated.tsx
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item
        id="public"
        // eslint-disable-next-line no-console
        onExpandedChange={isExpanded => console.log(`${isExpanded ? 'Expanded' : 'Collapsed'} "public" folder `)}
      >
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        public
        <TreeView.SubTree>
          <TreeView.Item id="public/index.html">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            index.html
          </TreeView.Item>
          <TreeView.Item id="public/favicon.ico">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            favicon.ico
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="package.json">
        <TreeView.LeadingVisual>
          <FileIcon />
        </TreeView.LeadingVisual>
        package.json
      </TreeView.Item>
    </TreeView>
  </nav>
)

export const FilesChanged: StoryFn = () => {
  return (
    <nav aria-label="Files">
      <TreeView aria-label="Files" truncate={false}>
        <TreeView.Item id="src" defaultExpanded>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          src
          <TreeView.SubTree>
            <TreeView.Item id="src/Avatar.tsx">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              Avatar.tsx
              <TreeView.TrailingVisual label="added">
                <Octicon icon={DiffAddedIcon} className={classes.SuccessIcon} />
              </TreeView.TrailingVisual>
            </TreeView.Item>
            <TreeView.Item id="src/Button" defaultExpanded>
              <TreeView.LeadingVisual>
                <TreeView.DirectoryIcon />
              </TreeView.LeadingVisual>
              Button
              <TreeView.SubTree>
                <TreeView.Item id="src/Button/Button.tsx" current>
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  Button.tsx
                  <TreeView.TrailingVisual label="modified">
                    <Octicon icon={DiffModifiedIcon} className={classes.AttentionIcon} />
                  </TreeView.TrailingVisual>
                </TreeView.Item>
                <TreeView.Item id="src/Button/Button.test.tsx">
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  Button.test.tsx
                  <TreeView.TrailingVisual label="modified">
                    <Octicon icon={DiffModifiedIcon} className={classes.AttentionIcon} />
                  </TreeView.TrailingVisual>
                </TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
            <TreeView.Item id="src/ReallyLongFileNameThatShouldBeTruncated.tsx">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              ReallyLongFileNameThatShouldBeTruncated.tsx
              <TreeView.TrailingVisual label="modified">
                <Octicon icon={DiffModifiedIcon} className={classes.AttentionIcon} />
              </TreeView.TrailingVisual>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="public" defaultExpanded>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          public
          <TreeView.SubTree>
            <TreeView.Item id="public/index.html">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              index.html
              <TreeView.TrailingVisual label="renamed">
                <Octicon icon={DiffRenamedIcon} />
              </TreeView.TrailingVisual>
            </TreeView.Item>
            <TreeView.Item id="public/favicon.ico">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              favicon.ico
              <TreeView.TrailingVisual label="removed">
                <Octicon icon={DiffRemovedIcon} className={classes.DangerIcon} />
              </TreeView.TrailingVisual>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>
    </nav>
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
      expanded: true,
    },
    children: expandAll(item.children),
  }))
}

function collapseAll(tree: TreeItem[]): TreeItem[] {
  return tree.map(item => ({
    data: {
      ...item.data,
      expanded: false,
    },
    children: collapseAll(item.children),
  }))
}

function setExpanded(tree: TreeItem[], path: string[], expanded: boolean): TreeItem[] {
  return tree.map(item => {
    if (item.data.name === path[0] && path.length === 1) {
      return {
        ...item,
        data: {
          ...item.data,
          expanded,
        },
      }
    } else if (item.data.name === path[0]) {
      return {
        ...item,
        children: setExpanded(item.children, path.slice(1), expanded),
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
  setCurrentPath: () => {},
})

const initialTree: TreeItem[] = Array.from({length: 5}).map((_, i) => ({
  data: {
    name: `Item ${i}`,
    expanded: false,
  },
  children: Array.from({length: 5}).map((_, j) => ({
    data: {
      name: `Item ${i}.${j}`,
      expanded: false,
    },
    children: Array.from({length: 5}).map((_, k) => ({
      data: {
        name: `Item ${i}.${j}.${k}`,
        expanded: false,
      },
      children: [],
    })),
  })),
}))

export const Controlled: StoryFn = () => {
  const [currentPath, setCurrentPath] = React.useState<string[]>(['src', 'Avatar.tsx'])
  const [tree, setTree] = React.useState<TreeItem[]>(initialTree)

  return (
    <div className={classes.ControlledContainer}>
      <div className={classes.ButtonContainer}>
        <Button onClick={() => setTree(collapseAll)}>Collapse all</Button>
        <Button onClick={() => setTree(expandAll)}>Expand all</Button>
      </div>
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
    </div>
  )
}

function TreeItem({
  item,
  path,
  onExpandedChange,
}: {
  item: TreeItem
  path: string[]
  onExpandedChange: (path: string[], expanded: boolean) => void
}) {
  const {currentPath, setCurrentPath} = React.useContext(CurrentPathContext)
  return (
    <TreeView.Item
      id={path.join('/')}
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

export const AsyncSuccess: StoryFn = args => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [asyncItems, setAsyncItems] = React.useState<string[]>([])

  let state: SubTreeState = 'initial'

  if (isLoading) {
    state = 'loading'
  } else if (asyncItems.length > 0) {
    state = 'done'
  }

  return (
    <nav aria-label="Files">
      <TreeView aria-label="Files">
        <TreeView.Item id="file-1">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          Some file
        </TreeView.Item>
        <TreeView.Item
          id="async-directory"
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
              <TreeView.Item id={`item-${item}`} key={item}>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                {item}
              </TreeView.Item>
            ))}
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="another-file">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          Another file
        </TreeView.Item>
      </TreeView>
    </nav>
  )
}

AsyncSuccess.args = {
  responseTime: 4000,
}

export const AsyncWithCount: StoryFn = args => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [asyncItems, setAsyncItems] = React.useState<string[]>([])

  let state: SubTreeState = 'initial'

  if (isLoading) {
    state = 'loading'
  } else if (asyncItems.length > 0) {
    state = 'done'
  }

  return (
    <nav aria-label="Files">
      <TreeView aria-label="Files">
        <TreeView.Item id="some-file">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          Some file
        </TreeView.Item>
        <TreeView.Item
          id="async-directory"
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
              <TreeView.Item key={item} id={`item-${item}`}>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                {item}
              </TreeView.Item>
            ))}
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="another-file">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          Another file
        </TreeView.Item>
      </TreeView>
    </nav>
  )
}

AsyncWithCount.args = {
  responseTime: 2000,
  count: 3,
}

AsyncWithCount.argTypes = {
  count: {
    type: 'number',
  },
}

AsyncWithCount.storyName = 'Async with count (skeleton nodes)'

async function alwaysFails(responseTime: number) {
  await wait(responseTime)
  throw new Error('Failed to load items')
  return []
}

export const AsyncError: StoryFn = args => {
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
    <TreeView aria-label="Files">
      <TreeView.Item id="some-file">
        <TreeView.LeadingVisual>
          <FileIcon />
        </TreeView.LeadingVisual>
        Some file
      </TreeView.Item>
      <TreeView.Item
        id="async-directory"
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
            <TreeView.Item key={item} id={`item-${item}`}>
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              {item}
            </TreeView.Item>
          ))}
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="another-file">
        <TreeView.LeadingVisual>
          <FileIcon />
        </TreeView.LeadingVisual>
        Another file
      </TreeView.Item>
    </TreeView>
  )
}

AsyncError.args = {
  responseTime: 2000,
}

export const EmptyDirectories: StoryFn = () => {
  const [state, setState] = React.useState<SubTreeState>('initial')
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
    <TreeView aria-label="Files">
      <TreeView.Item
        id="src"
        onExpandedChange={expanded => {
          setState('loading')
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
      <TreeView.Item id=".github">
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        .github
        <TreeView.SubTree />
      </TreeView.Item>
    </TreeView>
  )
}

export const NestedTrees: StoryFn = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [asyncItems, setAsyncItems] = React.useState<string[]>([])

  let state: SubTreeState = 'initial'

  if (isLoading) {
    state = 'loading'
  } else if (asyncItems.length > 0) {
    state = 'done'
  }

  return (
    <nav aria-label="Files">
      <TreeView aria-label="Files">
        <TreeView.Item id="file-1">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          Some file
        </TreeView.Item>
        <TreeView.Item
          id="async-directory"
          onExpandedChange={async isExpanded => {
            if (asyncItems.length === 0 && isExpanded) {
              setIsLoading(true)

              // Load items
              const items = await loadItems(1000)

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
              <TreeView.Item id={`item-${item}`} key={item}>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                {item}
              </TreeView.Item>
            ))}
            <TreeView.Item id="nested-directory">
              Nested Sub-tree
              <TreeView.SubTree state="done">
                <TreeView.Item id="nested-directory/file-1">
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  Some file
                </TreeView.Item>
                <TreeView.Item id="nested-directory/another-file">
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  Another file
                </TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="another-file">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          Another file
        </TreeView.Item>
      </TreeView>
    </nav>
  )
}

export const NestedScrollContainer: StoryFn = () => {
  return (
    <div className={classes.ScrollContainer}>
      <TreeView aria-label="Files">
        {Array.from({length: 100}).map((_, i) => (
          <TreeView.Item key={i} id={`directory-${i}`}>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            Directory {i}
            <TreeView.SubTree>
              {Array.from({length: 10}).map((_, j) => (
                <TreeView.Item
                  key={j}
                  id={`directory-${i}/file-${j}`}
                  // eslint-disable-next-line no-console
                  onSelect={() => console.log(`Directory ${i}/File ${j}`)}
                >
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
    </div>
  )
}

export const StressTest: StoryFn = () => {
  return (
    <TreeView aria-label="Files">
      {Array.from({length: 1000}).map((_, i) => (
        <TreeView.Item key={i} id={`directory-${i}`}>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          Directory {i}
          <TreeView.SubTree>
            {Array.from({length: 100}).map((_, j) => (
              <TreeView.Item key={j} id={`directory-${i}/file-${j}`}>
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
  )
}

export const ContainIntrinsicSize: StoryFn = () => {
  return (
    <TreeView aria-label="Files">
      {Array.from({length: 10}).map((_, i) => (
        <TreeView.Item key={i} id={`directory-${i}`} defaultExpanded containIntrinsicSize="2rem">
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          Directory {i}
          <TreeView.SubTree>
            {Array.from({length: 1000}).map((_, j) => (
              <TreeView.Item key={j} id={`directory-${i}/file-${j}`} containIntrinsicSize="2rem">
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
  )
}

export const InitialFocus: StoryFn = () => (
  <div>
    <Button>Focusable element before TreeView</Button>
    <TreeView aria-label="Test tree" truncate={false}>
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
          </TreeView.Item>
          <TreeView.Item id="src/Button" defaultExpanded>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            Button
            <TreeView.SubTree>
              <TreeView.Item id="src/Button/Button.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button.test.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button.test.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button2.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button2.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button2.test.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button2.test.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button3.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button3.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button3.test.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button3.test.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button4.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button4.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button4.test.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button4.test.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button5.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button5.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button5.test.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button5.test.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button6.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button6.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button6.test.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button6.test.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button7.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button7.tsx
              </TreeView.Item>
              <TreeView.Item id="src/Button/Button7.test.tsx" current>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button7.test.tsx
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="src/ReallyLongFileNameThatShouldNotBeTruncated.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            ReallyLongFileNameThatShouldNotBeTruncated.tsx
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView>
    <Button>Focusable element after TreeView</Button>
  </div>
)

export const FocusManagement: StoryFn = () => (
  <div>
    <Button>Focusable element before TreeView</Button>
    <TreeView aria-label="Test tree">
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
            <IconButton
              variant="invisible"
              icon={KebabHorizontalIcon}
              aria-label="Secondary actions"
              aria-hidden
              tabIndex={-1}
            ></IconButton>
          </TreeView.Item>
          <TreeView.Item id="src/Button" defaultExpanded>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            Button
            <TreeView.SubTree>
              <TreeView.Item id="src/Button/Button.tsx">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Button.tsx
                <IconButton
                  variant="invisible"
                  icon={KebabHorizontalIcon}
                  aria-label="Secondary actions"
                  aria-hidden
                  tabIndex={-1}
                ></IconButton>
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView>
    <Button>Focusable element after TreeView</Button>
  </div>
)

export const WithoutIndentation: StoryFn = () => (
  <nav aria-label="Files changed">
    <TreeView aria-label="Files changed" flat>
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
            <TreeView.TrailingVisual label="Added">
              <Octicon icon={DiffAddedIcon} className={classes.SuccessIcon} />
            </TreeView.TrailingVisual>
          </TreeView.Item>
          <TreeView.Item id="src/Button.tsx" current>
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Button.tsx
            <TreeView.TrailingVisual label="Modified">
              <Octicon icon={DiffModifiedIcon} className={classes.AttentionIcon} />
            </TreeView.TrailingVisual>
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="package.json">
        <TreeView.LeadingVisual>
          <FileIcon />
        </TreeView.LeadingVisual>
        package.json
        <TreeView.TrailingVisual label="Modified">
          <Octicon icon={DiffModifiedIcon} className={classes.AttentionIcon} />
        </TreeView.TrailingVisual>
      </TreeView.Item>
    </TreeView>
  </nav>
)

export const MultilineItems: StoryFn = () => (
  <nav aria-label="Files changed">
    <TreeView aria-label="Files changed" truncate={false}>
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        this is a very long directory name that we have intentionally allowed to wrap over multiple lines to demonstrate
        alignment
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
            <TreeView.TrailingVisual label="Added">
              <Octicon icon={DiffAddedIcon} className={classes.SuccessIcon} />
            </TreeView.TrailingVisual>
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        this is a medium directory name that we wrap over 2 lines to demonstrate alignment
        <TreeView.TrailingVisual label="Added">
          <Octicon icon={DiffAddedIcon} className={classes.SuccessIcon} />
        </TreeView.TrailingVisual>
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
            <TreeView.TrailingVisual label="Added">
              <Octicon icon={DiffAddedIcon} className={classes.SuccessIcon} />
            </TreeView.TrailingVisual>
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        this is a very long directory name that we have intentionally NOT allowed to wrap over multiple lines to
        demonstrate alignment
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
            <TreeView.TrailingVisual label="Added">
              <Octicon icon={DiffAddedIcon} className={classes.SuccessIcon} />
            </TreeView.TrailingVisual>
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        short name
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Avatar.tsx
            <TreeView.TrailingVisual label="Added">
              <Octicon icon={DiffAddedIcon} className={classes.SuccessIcon} />
            </TreeView.TrailingVisual>
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView>
  </nav>
)

export default meta
