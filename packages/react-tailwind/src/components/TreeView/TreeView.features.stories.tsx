import {
  DiffAddedIcon,
  DiffModifiedIcon,
  DiffRemovedIcon,
  DiffRenamedIcon,
  FileIcon,
  KebabHorizontalIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
import {type SubTreeState, TreeView} from './TreeView'

const meta = {
  title: 'React Tailwind/Navigation/TreeView/Features',
  component: TreeView,
  decorators: [
    Story => (
      <div className="max-w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeView>

export default meta
type Story = StoryObj<typeof meta>

const files = (
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
      <TreeView.Item id="public">
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

export const Files: Story = {render: () => files}

export const WithoutGuides: Story = {
  render: () => (
    <TreeView aria-label="Files" className="[--tree-indent-size:1.5rem]" showGuides={false} truncate={false}>
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree>
          <TreeView.Item id="index">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            index.ts
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView>
  ),
}

export const LabelClipping: Story = {
  render: () => (
    <div style={{width: 160}}>
      <TreeView aria-label="Files">
        <TreeView.Item id="file" aria-label="Very-long-file-name-with-changes.tsx, modified">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          Very-long-file-name-with-changes.tsx
          <TreeView.TrailingVisual>
            <DiffModifiedIcon />
          </TreeView.TrailingVisual>
        </TreeView.Item>
      </TreeView>
    </div>
  ),
}

export const LinkedFiles: Story = {
  render: () => (
    <TreeView.LinkTree aria-label="Files">
      <TreeView.Item id="src" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.LinkTree.SubTree>
          <TreeView.Item as="a" href="#index-ts" id="src/index.ts" current aria-label="File index.ts, modified">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            index.ts
            <TreeView.TrailingVisual label="modified">
              <DiffModifiedIcon />
            </TreeView.TrailingVisual>
          </TreeView.Item>
          <TreeView.Item as="a" href="#button-ts" id="src/Button.tsx">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            Button.tsx
          </TreeView.Item>
        </TreeView.LinkTree.SubTree>
      </TreeView.Item>
      <TreeView.Item as="a" href="#docs" id="docs" defaultExpanded>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        docs
        <TreeView.LinkTree.SubTree>
          <TreeView.Item as="a" href="#guide" id="docs/guide.md">
            <TreeView.LeadingVisual>
              <FileIcon />
            </TreeView.LeadingVisual>
            guide.md
          </TreeView.Item>
        </TreeView.LinkTree.SubTree>
      </TreeView.Item>
    </TreeView.LinkTree>
  ),
}

export const LinkTreeVisualParity: Story = {
  render: () => (
    <div className="flex gap-4">
      <TreeView aria-label="Standard files" className="w-full">
        <TreeView.Item id="standard-file">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          index.ts
        </TreeView.Item>
        <TreeView.Item id="standard-current" current>
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          README.md
        </TreeView.Item>
      </TreeView>
      <TreeView.LinkTree aria-label="Linked files" className="w-full">
        <TreeView.Item as="a" href="#index" id="linked-file">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          index.ts
        </TreeView.Item>
        <TreeView.Item as="a" current href="#readme" id="linked-current">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          README.md
        </TreeView.Item>
      </TreeView.LinkTree>
    </div>
  ),
}

export const FilesChanged: Story = {
  render: () => (
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
              <TreeView.TrailingVisual label="added" className="text-success">
                <DiffAddedIcon />
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
                  <TreeView.TrailingVisual label="modified" className="text-attention">
                    <DiffModifiedIcon />
                  </TreeView.TrailingVisual>
                </TreeView.Item>
                <TreeView.Item id="src/Button/Button.test.tsx">
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  Button.test.tsx
                  <TreeView.TrailingVisual label="modified" className="text-attention">
                    <DiffModifiedIcon />
                  </TreeView.TrailingVisual>
                </TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
            <TreeView.Item id="src/ReallyLongFileNameThatShouldBeTruncated.tsx">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              ReallyLongFileNameThatShouldBeTruncated.tsx
              <TreeView.TrailingVisual label="modified" className="text-attention">
                <DiffModifiedIcon />
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
                <DiffRenamedIcon />
              </TreeView.TrailingVisual>
            </TreeView.Item>
            <TreeView.Item id="public/favicon.ico">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              favicon.ico
              <TreeView.TrailingVisual label="removed" className="text-danger">
                <DiffRemovedIcon />
              </TreeView.TrailingVisual>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>
    </nav>
  ),
}

type ControlledTreeItem = {data: {name: string; expanded: boolean}; children: ControlledTreeItem[]}

function setAllExpanded(tree: ControlledTreeItem[], expanded: boolean): ControlledTreeItem[] {
  return tree.map(item => ({data: {...item.data, expanded}, children: setAllExpanded(item.children, expanded)}))
}

function setExpandedAt(tree: ControlledTreeItem[], path: string[], expanded: boolean): ControlledTreeItem[] {
  return tree.map(item => {
    if (item.data.name !== path[0]) return item
    if (path.length === 1) return {...item, data: {...item.data, expanded}}
    return {...item, children: setExpandedAt(item.children, path.slice(1), expanded)}
  })
}

const initialTree: ControlledTreeItem[] = Array.from({length: 5}, (_, i) => ({
  data: {name: `Item ${i}`, expanded: false},
  children: Array.from({length: 5}, (_, j) => ({
    data: {name: `Item ${i}.${j}`, expanded: false},
    children: Array.from({length: 5}, (_, k) => ({data: {name: `Item ${i}.${j}.${k}`, expanded: false}, children: []})),
  })),
}))

type ControlledItemProps = {
  currentPath: string[]
  item: ControlledTreeItem
  onCurrentPathChange: (path: string[]) => void
  onExpandedChange: (path: string[], expanded: boolean) => void
  path: string[]
}

function ControlledItem({currentPath, item, onCurrentPathChange, onExpandedChange, path}: ControlledItemProps) {
  return (
    <TreeView.Item
      id={path.join('/')}
      current={currentPath.join('/') === path.join('/')}
      expanded={item.data.expanded}
      onExpandedChange={expanded => onExpandedChange(path, expanded)}
      onSelect={() => onCurrentPathChange(path)}
    >
      {item.data.name}
      {item.children.length > 0 ? (
        <TreeView.SubTree>
          {item.children.map(child => (
            <ControlledItem
              key={child.data.name}
              currentPath={currentPath}
              item={child}
              onCurrentPathChange={onCurrentPathChange}
              onExpandedChange={onExpandedChange}
              path={[...path, child.data.name]}
            />
          ))}
        </TreeView.SubTree>
      ) : null}
    </TreeView.Item>
  )
}

function ControlledTree() {
  const [currentPath, setCurrentPath] = React.useState<string[]>(['src', 'Avatar.tsx'])
  const [tree, setTree] = React.useState(initialTree)
  const handleExpandedChange = (path: string[], expanded: boolean) =>
    setTree(current => setExpandedAt(current, path, expanded))

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <Button onClick={() => setTree(current => setAllExpanded(current, false))}>Collapse all</Button>
        <Button onClick={() => setTree(current => setAllExpanded(current, true))}>Expand all</Button>
      </div>
      <nav aria-label="Files">
        <TreeView aria-label="Files">
          {tree.map(item => (
            <ControlledItem
              key={item.data.name}
              currentPath={currentPath}
              item={item}
              onCurrentPathChange={setCurrentPath}
              onExpandedChange={handleExpandedChange}
              path={[item.data.name]}
            />
          ))}
        </TreeView>
      </nav>
    </div>
  )
}

export const Controlled: Story = {render: () => <ControlledTree />}

function wait(ms: number) {
  return new Promise(resolve => window.setTimeout(resolve, ms))
}

async function loadItems(responseTime: number) {
  await wait(responseTime)
  return ['Avatar.tsx', 'Button.tsx', 'Checkbox.tsx']
}

async function alwaysFails(responseTime: number): Promise<string[]> {
  await wait(responseTime)
  throw new Error('Failed to load items')
}

function getSubTreeState(isLoading: boolean, items: string[], error?: Error | null): SubTreeState {
  if (isLoading) return 'loading'
  if (error) return 'error'
  return items.length > 0 ? 'done' : 'initial'
}

type AsyncTreeProps = {
  /** Number of skeleton rows to show while loading. */
  count?: number
  /** Adds a directory, already loaded, after the async items. */
  nested?: boolean
  /** Milliseconds the fake request takes. */
  responseTime: number
}

function AsyncTree({count, nested = false, responseTime}: AsyncTreeProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [asyncItems, setAsyncItems] = React.useState<string[]>([])

  const handleExpandedChange = async (expanded: boolean) => {
    if (!expanded || asyncItems.length > 0) return
    setIsLoading(true)
    const items = await loadItems(responseTime)
    setIsLoading(false)
    setAsyncItems(items)
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
        <TreeView.Item id="async-directory" onExpandedChange={handleExpandedChange}>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          Directory with async items
          <TreeView.SubTree state={getSubTreeState(isLoading, asyncItems)} count={count}>
            {asyncItems.map(item => (
              <TreeView.Item key={item} id={`item-${item}`}>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                {item}
              </TreeView.Item>
            ))}
            {nested ? (
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
            ) : null}
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

type AsyncStory = StoryObj<{responseTime: number}>

export const AsyncSuccess: AsyncStory = {
  args: {responseTime: 4000},
  render: ({responseTime}) => <AsyncTree responseTime={responseTime} />,
}

export const AsyncWithCount: StoryObj<{count: number; responseTime: number}> = {
  name: 'Async with count (skeleton nodes)',
  args: {count: 3, responseTime: 2000},
  argTypes: {count: {control: 'number'}},
  render: ({count, responseTime}) => <AsyncTree count={count} responseTime={responseTime} />,
}

function AsyncErrorTree({responseTime}: {responseTime: number}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [asyncItems, setAsyncItems] = React.useState<string[]>([])
  const [error, setError] = React.useState<Error | null>(null)

  const load = async () => {
    if (asyncItems.length > 0) return
    setIsLoading(true)
    try {
      setAsyncItems(await alwaysFails(responseTime))
    } catch (caught) {
      setError(caught instanceof Error ? caught : new Error(String(caught)))
    } finally {
      setIsLoading(false)
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
      <TreeView.Item id="async-directory" onExpandedChange={expanded => expanded && void load()}>
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        Directory with async items
        <TreeView.SubTree state={getSubTreeState(isLoading, asyncItems, error)}>
          {error ? (
            <TreeView.ErrorDialog
              onRetry={() => {
                setError(null)
                void load()
              }}
              onDismiss={() => setError(null)}
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

export const AsyncError: AsyncStory = {
  args: {responseTime: 2000},
  render: ({responseTime}) => <AsyncErrorTree responseTime={responseTime} />,
}

function EmptyDirectoriesTree() {
  const [expanded, setExpanded] = React.useState(false)
  const [state, setState] = React.useState<SubTreeState>('initial')

  React.useEffect(() => {
    if (!expanded || state !== 'loading') return
    const timeout = window.setTimeout(() => setState('done'), 2000)
    return () => window.clearTimeout(timeout)
  }, [expanded, state])

  return (
    <TreeView aria-label="Files">
      <TreeView.Item
        id="src"
        onExpandedChange={next => {
          setExpanded(next)
          setState('loading')
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

export const EmptyDirectories: Story = {render: () => <EmptyDirectoriesTree />}

export const NestedTrees: Story = {render: () => <AsyncTree nested responseTime={1000} />}

export const NestedScrollContainer: Story = {
  render: () => (
    <div className="max-h-[50vh] overflow-auto">
      <TreeView aria-label="Files">
        {Array.from({length: 100}, (_, directory) => (
          <TreeView.Item key={directory} id={`directory-${directory}`}>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            Directory {directory}
            <TreeView.SubTree>
              {Array.from({length: 10}, (_, file) => (
                <TreeView.Item key={file} id={`directory-${directory}/file-${file}`}>
                  <TreeView.LeadingVisual>
                    <FileIcon />
                  </TreeView.LeadingVisual>
                  File {file}
                </TreeView.Item>
              ))}
            </TreeView.SubTree>
          </TreeView.Item>
        ))}
      </TreeView>
    </div>
  ),
}

export const StressTest: Story = {
  render: () => (
    <TreeView aria-label="Files">
      {Array.from({length: 1000}, (_, directory) => (
        <TreeView.Item key={directory} id={`directory-${directory}`}>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          Directory {directory}
          <TreeView.SubTree>
            {Array.from({length: 100}, (_, file) => (
              <TreeView.Item key={file} id={`directory-${directory}/file-${file}`}>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                File {file}
              </TreeView.Item>
            ))}
          </TreeView.SubTree>
        </TreeView.Item>
      ))}
    </TreeView>
  ),
}

export const ContainIntrinsicSize: Story = {
  render: () => (
    <TreeView aria-label="Files">
      {Array.from({length: 10}, (_, directory) => (
        <TreeView.Item key={directory} id={`directory-${directory}`} defaultExpanded containIntrinsicSize="2rem">
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          Directory {directory}
          <TreeView.SubTree>
            {Array.from({length: 1000}, (_, file) => (
              <TreeView.Item key={file} id={`directory-${directory}/file-${file}`} containIntrinsicSize="2rem">
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                File {file}
              </TreeView.Item>
            ))}
          </TreeView.SubTree>
        </TreeView.Item>
      ))}
    </TreeView>
  ),
}

export const CurrentItemWithContainIntrinsicSize: Story = {
  render: () => (
    <TreeView aria-label="Files">
      {['File 1', 'File 2', 'File 3'].map((file, index) => (
        <TreeView.Item key={file} id={`file-${index + 1}`} current={index === 1} containIntrinsicSize="2rem">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          {file}
        </TreeView.Item>
      ))}
    </TreeView>
  ),
}

const focusTree = (
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
            {[
              'Button.tsx',
              'Button.test.tsx',
              'Button2.tsx',
              'Button2.test.tsx',
              'Button3.tsx',
              'Button3.test.tsx',
              'Button4.tsx',
              'Button4.test.tsx',
              'Button5.tsx',
              'Button5.test.tsx',
              'Button6.tsx',
              'Button6.test.tsx',
              'Button7.tsx',
              'Button7.test.tsx',
            ].map((file, index) => (
              <TreeView.Item key={file} id={`src/Button/${file}`} current={index === 13}>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                {file}
              </TreeView.Item>
            ))}
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
)

export const InitialFocus: Story = {
  render: () => (
    <div>
      <Button>Focusable element before TreeView</Button>
      {focusTree}
      <Button>Focusable element after TreeView</Button>
    </div>
  ),
}

export const FocusManagement: Story = {
  render: () => (
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
              />
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
                  />
                </TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>
      <Button>Focusable element after TreeView</Button>
    </div>
  ),
}

export const WithoutIndentation: Story = {
  render: () => (
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
              <TreeView.TrailingVisual label="added" className="text-success">
                <DiffAddedIcon />
              </TreeView.TrailingVisual>
            </TreeView.Item>
            <TreeView.Item id="src/Button.tsx" current>
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              Button.tsx
              <TreeView.TrailingVisual label="modified" className="text-attention">
                <DiffModifiedIcon />
              </TreeView.TrailingVisual>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="package.json">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          package.json
          <TreeView.TrailingVisual label="modified" className="text-attention">
            <DiffModifiedIcon />
          </TreeView.TrailingVisual>
        </TreeView.Item>
      </TreeView>
    </nav>
  ),
}

export const MultilineItems: Story = {
  render: () => (
    <nav aria-label="Files changed">
      <TreeView aria-label="Files changed" truncate={false}>
        {[
          'this is a very long directory name that we have intentionally allowed to wrap over multiple lines to demonstrate alignment',
          'this is a medium directory name that we wrap over 2 lines to demonstrate alignment',
          'this is a very long directory name that we have intentionally NOT allowed to wrap over multiple lines to demonstrate alignment',
          'short name',
        ].map((name, index) => (
          <TreeView.Item key={name} id={`src-${index}`} defaultExpanded>
            <TreeView.LeadingVisual>
              <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            {name}
            {index === 1 ? (
              <TreeView.TrailingVisual label="added" className="text-success">
                <DiffAddedIcon />
              </TreeView.TrailingVisual>
            ) : null}
            <TreeView.SubTree>
              <TreeView.Item id={`src-${index}/Avatar.tsx`}>
                <TreeView.LeadingVisual>
                  <FileIcon />
                </TreeView.LeadingVisual>
                Avatar.tsx
                <TreeView.TrailingVisual label="added" className="text-success">
                  <DiffAddedIcon />
                </TreeView.TrailingVisual>
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        ))}
      </TreeView>
    </nav>
  ),
}

const CustomRouterLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {to: string}
>(function CustomRouterLink({children, to, ...props}, ref) {
  return (
    <a {...props} ref={ref} href={to} data-custom-link>
      {children}
    </a>
  )
})

export const AsProp: Story = {
  render: () => (
    <nav aria-label="Docs">
      <TreeView aria-label="Docs">
        <TreeView.Item id="overview" as="a" href="#overview">
          <TreeView.LeadingVisual>
            <FileIcon />
          </TreeView.LeadingVisual>
          Overview (native anchor)
        </TreeView.Item>
        <TreeView.Item id="guides" defaultExpanded>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          Guides
          <TreeView.SubTree>
            <TreeView.Item id="guides/install" as={CustomRouterLink} to="/guides/install">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              Install (router link)
            </TreeView.Item>
            <TreeView.Item id="guides/setup" as={CustomRouterLink} to="/guides/setup">
              <TreeView.LeadingVisual>
                <FileIcon />
              </TreeView.LeadingVisual>
              Setup (router link)
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>
    </nav>
  ),
}
