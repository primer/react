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
import {TreeView} from './TreeView'

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

type ControlledTreeItem = {name: string; expanded: boolean; children: ControlledTreeItem[]}
const initialTree: ControlledTreeItem[] = Array.from({length: 5}, (_, directory) => ({
  name: `Item ${directory}`,
  expanded: false,
  children: Array.from({length: 5}, (_, child) => ({
    name: `Item ${directory}.${child}`,
    expanded: false,
    children: Array.from({length: 5}, (_, grandchild) => ({
      name: `Item ${directory}.${child}.${grandchild}`,
      expanded: false,
      children: [],
    })),
  })),
}))

function ControlledItem({item, path}: {item: ControlledTreeItem; path: string}) {
  const [expanded, setExpanded] = React.useState(item.expanded)
  return (
    <TreeView.Item id={path} expanded={expanded} onExpandedChange={setExpanded}>
      {item.name}
      {item.children.length > 0 ? (
        <TreeView.SubTree>
          {item.children.map(child => (
            <ControlledItem key={child.name} item={child} path={`${path}/${child.name}`} />
          ))}
        </TreeView.SubTree>
      ) : null}
    </TreeView.Item>
  )
}

export const Controlled: Story = {
  render: () => {
    const [allExpanded, setAllExpanded] = React.useState<boolean | null>(null)
    return (
      <div className="grid gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setAllExpanded(false)}>Collapse all</Button>
          <Button onClick={() => setAllExpanded(true)}>Expand all</Button>
        </div>
        <nav aria-label="Files">
          <TreeView aria-label="Files">
            {initialTree.map(item => (
              <TreeView.Item
                key={item.name}
                id={item.name}
                expanded={allExpanded ?? item.expanded}
                onExpandedChange={() => setAllExpanded(null)}
              >
                {item.name}
                <TreeView.SubTree>
                  {item.children.map(child => (
                    <ControlledItem key={child.name} item={child} path={`${item.name}/${child.name}`} />
                  ))}
                </TreeView.SubTree>
              </TreeView.Item>
            ))}
          </TreeView>
        </nav>
      </div>
    )
  },
}

function AsyncTree({count, fail = false}: {count?: number; fail?: boolean}) {
  const [state, setState] = React.useState<'initial' | 'loading' | 'done' | 'error'>('initial')
  const [items, setItems] = React.useState<string[]>([])
  const load = () => {
    setState('loading')
    window.setTimeout(() => {
      if (fail) {
        setState('error')
      } else {
        setItems(['Avatar.tsx', 'Button.tsx', 'Checkbox.tsx'])
        setState('done')
      }
    }, 1000)
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
        <TreeView.Item id="async-directory" onExpandedChange={expanded => expanded && state === 'initial' && load()}>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          Directory with async items
          <TreeView.SubTree state={state} count={count}>
            {state === 'error' ? (
              <li role="none" className="px-2 py-1 text-danger">
                Failed to load items
              </li>
            ) : null}
            {items.map(item => (
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

export const AsyncSuccess: Story = {render: () => <AsyncTree />}
export const AsyncWithCount: Story = {render: () => <AsyncTree count={3} />}
export const AsyncError: Story = {render: () => <AsyncTree fail />}

export const EmptyDirectories: Story = {
  render: () => (
    <TreeView aria-label="Files">
      <TreeView.Item id="src">
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        src
        <TreeView.SubTree state="done" />
      </TreeView.Item>
      <TreeView.Item id=".github">
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        .github
        <TreeView.SubTree />
      </TreeView.Item>
    </TreeView>
  ),
}

export const NestedTrees: Story = {render: () => <AsyncTree />}

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
