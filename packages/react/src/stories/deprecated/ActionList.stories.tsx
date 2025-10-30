import {
  ServerIcon,
  PlusCircleIcon,
  TypographyIcon,
  VersionsIcon,
  SearchIcon,
  NoteIcon,
  ProjectIcon,
  FilterIcon,
  GearIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@primer/octicons-react'
import type {Meta} from '@storybook/react-vite'
import React, { forwardRef, type JSX } from 'react';
import {Label} from '../..'
import {ActionList as _ActionList} from '../../deprecated/ActionList'
import {Header} from '../../deprecated/ActionList/Header'
import {ReactRouterLikeLink} from '../../Pagination/mocks/ReactRouterLink'
import classes from './ActionListStories.module.css'

const ActionList = Object.assign(_ActionList, {
  Header,
})

const meta: Meta = {
  title: 'Deprecated/Components/ActionList',
  component: ActionList,
  parameters: {
    controls: {
      disable: true,
    },
  },
}
export default meta

const ErsatzOverlay = ({maxWidth, children, ...props}: {maxWidth?: string; children: React.ReactNode}) => (
  <div
    className={classes.ErsatzOverlay}
    style={maxWidth ? ({'--ersatz-overlay-max-width': maxWidth} as React.CSSProperties) : undefined}
    data-max-width={maxWidth ? '' : undefined}
    {...props}
  >
    {children}
  </div>
)

export function ActionsStory(): JSX.Element {
  return (
    <>
      <h1>Actions</h1>
      <ErsatzOverlay>
        <ActionList
          showItemDividers
          items={[
            {
              leadingVisual: ServerIcon,
              text: 'Open current Codespace',
              description:
                "Your existing Codespace will be opened to its previous state, and you'll be asked to manually switch to new-branch.",
              descriptionVariant: 'block',
            },
            {
              leadingVisual: PlusCircleIcon,
              text: 'Create new Codespace',
              description: 'Create a brand new Codespace with a fresh image and checkout this branch.',
              descriptionVariant: 'block',
            },
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ActionsStory.storyName = 'Actions'

export function SimpleListStory(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionList
          items={[
            {text: 'New file', showDivider: true},
            ActionList.Divider,
            {text: 'Copy link', showDivider: true},
            {text: 'Edit file', showDivider: true},
            {text: 'Delete file', variant: 'danger', showDivider: true},
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
SimpleListStory.storyName = 'Simple List'

const selectListItems = new Array(6).fill(undefined).map((_, i) => {
  return {
    text: `Item ${i}`,
    id: i,
  }
})

export function SingleSelectListStory(): JSX.Element {
  return (
    <>
      <h1 id="story-title">Single Select List</h1>
      <ErsatzOverlay>
        <ActionList
          role="listbox"
          aria-labelledby="story-title"
          items={selectListItems.map((item, index) => ({
            ...item,
            selected: index === 1,
            role: 'option',
          }))}
        />
      </ErsatzOverlay>
    </>
  )
}
SingleSelectListStory.storyName = 'Single Select'

export function MultiSelectListStory(): JSX.Element {
  return (
    <>
      <h1 id="story-title">Multi Select List</h1>
      <ErsatzOverlay>
        <ActionList
          role="listbox"
          aria-labelledby="story-title"
          selectionVariant="multiple"
          items={selectListItems.map((item, index) => ({
            ...item,
            selected: index === 1 || index === 3,
            role: 'option',
          }))}
        />
      </ErsatzOverlay>
    </>
  )
}
MultiSelectListStory.storyName = 'Multi Select'

export function ComplexListInsetVariantStory(): JSX.Element {
  return (
    <>
      <h1>Complex List</h1>
      <h2>Inset Variant</h2>
      <ErsatzOverlay>
        <ActionList
          groupMetadata={[
            {groupId: '0'},
            {groupId: '1', header: {title: 'Live query', variant: 'filled', 'aria-level': 3}},
            {groupId: '2', header: {title: 'Layout', variant: 'subtle', 'aria-level': 3}, showItemDividers: true},
            {groupId: '3', renderItem: props => <ActionList.Item {...props} className={classes.ActionListEmphasis} />},
            {
              groupId: '4',
              renderItem: ({leadingVisual: LeadingVisual, ...props}) => (
                <ActionList.Item
                  {...props}
                  leadingVisual={() => (
                    <div className={classes.StyledDivWithWhiteFill}>
                      {LeadingVisual && <LeadingVisual></LeadingVisual>}
                    </div>
                  )}
                />
              ),
              renderGroup: props => <ActionList.Group {...props} className={classes.CustomGroupStyle} />,
            },
          ]}
          items={[
            {leadingVisual: TypographyIcon, text: 'Rename', groupId: '0'},
            {
              leadingVisual: VersionsIcon,
              text: 'Duplicate',
              description: 'Create a copy',
              descriptionVariant: 'inline',
              groupId: '0',
            },
            {
              leadingVisual: SearchIcon,
              text: 'repo:github/memex,github/github',
              groupId: '1',
              renderItem: props => <ActionList.Item {...props} className={classes.ActionListAccent} />,
            },
            {
              leadingVisual: NoteIcon,
              text: 'Table',
              description: 'Information-dense table optimized for operations across teams',
              descriptionVariant: 'block',
              groupId: '2',
            },
            {
              leadingVisual: ProjectIcon,
              text: 'Board',
              description: 'Kanban-style board focused on visual states',
              descriptionVariant: 'block',
              groupId: '2',
            },
            {
              leadingVisual: FilterIcon,
              text: 'Save sort and filters to current view',
              groupId: '3',
            },
            {leadingVisual: FilterIcon, text: 'Save sort and filters to new view', groupId: '3'},
            {leadingVisual: GearIcon, text: 'View settings', groupId: '4'},
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ComplexListInsetVariantStory.storyName = 'Complex List — Inset Variant'

export function ComplexListFullVariantStory(): JSX.Element {
  return (
    <>
      <h1>Complex List</h1>
      <h2>Full Variant</h2>
      <ErsatzOverlay>
        <ActionList
          variant="full"
          groupMetadata={[
            {groupId: '0'},
            {groupId: '1', header: {title: 'Live query', variant: 'filled', 'aria-level': 3}},
            {groupId: '2', header: {title: 'Layout', variant: 'subtle', 'aria-level': 3}},
            {groupId: '3', renderItem: props => <ActionList.Item {...props} className={classes.ActionListEmphasis} />},
            {
              groupId: '4',
              renderItem: ({leadingVisual: LeadingVisual, ...props}) => (
                <ActionList.Item
                  {...props}
                  leadingVisual={() => (
                    <div className={classes.StyledDivWithWhiteFill}>
                      {LeadingVisual && <LeadingVisual></LeadingVisual>}
                    </div>
                  )}
                />
              ),
              renderGroup: props => <ActionList.Group {...props} className={classes.CustomGroupStyle} />,
            },
          ]}
          items={[
            {leadingVisual: TypographyIcon, text: 'Rename', groupId: '0'},
            {leadingVisual: VersionsIcon, text: 'Duplicate', groupId: '0'},
            {
              leadingVisual: SearchIcon,
              text: 'repo:github/memex,github/github',
              groupId: '1',
              renderItem: props => <ActionList.Item {...props} className={classes.ActionListAccent} />,
            },
            {
              leadingVisual: NoteIcon,
              text: 'Table',
              description: 'Information-dense table optimized for operations across teams',
              descriptionVariant: 'block',
              groupId: '2',
            },
            {
              leadingVisual: ProjectIcon,
              text: 'Board',
              description: 'Kanban-style board focused on visual states',
              descriptionVariant: 'block',
              groupId: '2',
            },
            {
              leadingVisual: FilterIcon,
              text: 'Save sort and filters to current view',
              groupId: '3',
            },
            {leadingVisual: FilterIcon, text: 'Save sort and filters to new view', groupId: '3'},
            {leadingVisual: GearIcon, text: 'View settings', groupId: '4'},
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ComplexListFullVariantStory.storyName = 'Complex List — Full Variant'

export function HeaderStory(): JSX.Element {
  return (
    <>
      <h1>Header</h1>
      <h2>Filled Variant</h2>
      <ActionList.Header title="Layout" variant="filled" aria-level={3} />
      <h2>Subtle Variant</h2>
      <ActionList.Header title="Layout" variant="subtle" aria-level={3} />
    </>
  )
}
HeaderStory.storyName = 'Header'

export function CustomItemChildren(): JSX.Element {
  return (
    <>
      <h1>Custom Item Children</h1>
      <ErsatzOverlay>
        <ActionList
          items={[
            {
              leadingVisual: ArrowRightIcon,
              children: <Label>Choose this one</Label>,
              trailingIcon: ArrowLeftIcon,
            },
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}

export function SizeStressTestingStory(): JSX.Element {
  return (
    <>
      <h1>Size Stress Testing</h1>
      <ErsatzOverlay maxWidth="300px">
        <ActionList
          items={[
            {
              leadingVisual: ArrowRightIcon,
              text: 'Block Description.  Long text should wrap',
              description: 'This description is long, but it is block so it wraps',
              descriptionVariant: 'block',
              trailingVisual: ArrowLeftIcon,
              showDivider: true,
            },
            {
              leadingVisual: ArrowRightIcon,
              text: 'Inline Description',
              description: 'This description gets truncated because it is inline',
              trailingVisual: ArrowLeftIcon,
              showDivider: true,
            },
            {
              leadingVisual: ArrowRightIcon,
              text: 'Really long text without a description should wrap',
              trailingIcon: ArrowLeftIcon, // backward compatible
              showDivider: true,
            },
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
SizeStressTestingStory.storyName = 'Size Stress Testing'

const NextJSLikeLink = forwardRef(
  ({href, children}: {href: string; children: React.ReactNode}, ref): React.ReactElement<any> => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href,
    }
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  },
)

export function LinkItemStory(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionList
          items={[
            {
              text: 'A. Vanilla action',
              renderItem: props => <ActionList.Item onAction={() => alert('hi?')} {...props} />,
            },
            {
              text: 'B. Vanilla link',
              renderItem: props => <ActionList.Item as="a" href="/about" {...props} />,
            },
            {
              text: 'C. React Router link',
              renderItem: props => <ActionList.Item as={ReactRouterLikeLink} to="/about" {...props} />,
            },
            {
              text: 'D. NextJS style',
              renderItem: props => (
                <NextJSLikeLink href="/about">
                  <ActionList.Item as="a" {...props} />
                </NextJSLikeLink>
              ),
            },
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
LinkItemStory.storyName = 'List with a link item'

export function DOMPropsStory(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionList
          items={[
            {
              text: 'One',
              onClick: () => alert('Hello'),
            },
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
DOMPropsStory.storyName = 'List an item input including DOM props'
