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
  ArrowLeftIcon
} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {Label, ThemeProvider} from '../..'
import {ActionList as _ActionList} from '../../deprecated/ActionList'
import {Header} from '../../deprecated/ActionList/Header'
import BaseStyles from '../../BaseStyles'
import sx from '../../sx'

const ActionList = Object.assign(_ActionList, {
  Header
})

const meta: Meta = {
  title: 'Deprecated components/ActionList',
  component: ActionList,
  decorators: [
    (Story: React.ComponentType<React.PropsWithChildren<unknown>>): JSX.Element => (
      <ThemeProvider>
        <BaseStyles>
          <Story />
        </BaseStyles>
      </ThemeProvider>
    )
  ],
  parameters: {
    controls: {
      disable: true
    }
  }
}
export default meta

const ErsatzOverlay = styled.div<{maxWidth?: string}>`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(149, 157, 165, 0.2);
  overflow: hidden;
  max-width: ${({maxWidth}) => maxWidth || 'none'};
`

export function ActionsStory(): JSX.Element {
  return (
    <>
      <h1>Actions</h1>
      <ErsatzOverlay>
        <ActionList
          role="listbox"
          showItemDividers
          items={[
            {
              leadingVisual: ServerIcon,
              text: 'Open current Codespace',
              description:
                "Your existing Codespace will be opened to its previous state, and you'll be asked to manually switch to new-branch.",
              descriptionVariant: 'block',
              role: 'option'
            },
            {
              leadingVisual: PlusCircleIcon,
              text: 'Create new Codespace',
              description: 'Create a brand new Codespace with a fresh image and checkout this branch.',
              descriptionVariant: 'block',
              role: 'option'
            }
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
          role="listbox"
          items={[
            {text: 'New file', showDivider: true, role: 'option'},
            ActionList.Divider,
            {text: 'Copy link', showDivider: true, role: 'option'},
            {text: 'Edit file', showDivider: true, role: 'option'},
            {text: 'Delete file', variant: 'danger', showDivider: true, role: 'option'}
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
    id: i
  }
})

export function SingleSelectListStory(): JSX.Element {
  return (
    <>
      <h1>Single Select List</h1>
      <ErsatzOverlay>
        <ActionList
          role="listbox"
          items={selectListItems.map((item, index) => ({
            ...item,
            selected: index === 1,
            role: 'option'
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
      <h1>Multi Select List</h1>
      <ErsatzOverlay>
        <ActionList
          role="listbox"
          selectionVariant="multiple"
          items={selectListItems.map((item, index) => ({
            ...item,
            selected: index === 1 || index === 3,
            role: 'option'
          }))}
        />
      </ErsatzOverlay>
    </>
  )
}
MultiSelectListStory.storyName = 'Multi Select'

export function ComplexListInsetVariantStory(): JSX.Element {
  const StyledDiv = styled.div`
    ${sx}
  `
  return (
    <>
      <h1>Complex List</h1>
      <h2>Inset Variant</h2>
      <ErsatzOverlay>
        <ActionList
          role="listbox"
          groupMetadata={[
            {groupId: '0'},
            {groupId: '1', header: {title: 'Live query', variant: 'filled'}},
            {groupId: '2', header: {title: 'Layout', variant: 'subtle'}, showItemDividers: true},
            {groupId: '3', renderItem: props => <ActionList.Item style={{fontWeight: 'bold'}} {...props} />},
            {
              groupId: '4',
              renderItem: ({leadingVisual: LeadingVisual, ...props}) => (
                <ActionList.Item
                  {...props}
                  leadingVisual={() => (
                    <StyledDiv sx={{'&>svg': {fill: 'white'}}}>
                      {LeadingVisual && <LeadingVisual></LeadingVisual>}
                    </StyledDiv>
                  )}
                />
              ),
              renderGroup: ({sx: sxProps, ...props}) => (
                <ActionList.Group {...props} sx={{...sxProps, backgroundColor: 'cornflowerblue', color: 'white'}} />
              )
            }
          ]}
          items={[
            {leadingVisual: TypographyIcon, text: 'Rename', groupId: '0'},
            {
              leadingVisual: VersionsIcon,
              text: 'Duplicate',
              description: 'Create a copy',
              descriptionVariant: 'inline',
              groupId: '0',
              role: 'option'
            },
            {
              leadingVisual: SearchIcon,
              text: 'repo:github/memex,github/github',
              groupId: '1',
              role: 'option',
              renderItem: props => <ActionList.Item style={{color: 'rebeccapurple'}} {...props} />
            },
            {
              leadingVisual: NoteIcon,
              text: 'Table',
              description: 'Information-dense table optimized for operations across teams',
              descriptionVariant: 'block',
              groupId: '2',
              role: 'option'
            },
            {
              leadingVisual: ProjectIcon,
              text: 'Board',
              description: 'Kanban-style board focused on visual states',
              descriptionVariant: 'block',
              groupId: '2',
              role: 'option'
            },
            {
              leadingVisual: FilterIcon,
              text: 'Save sort and filters to current view',
              groupId: '3',
              role: 'option'
            },
            {leadingVisual: FilterIcon, text: 'Save sort and filters to new view', groupId: '3', role: 'option'},
            {leadingVisual: GearIcon, text: 'View settings', groupId: '4', role: 'option'}
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
ComplexListInsetVariantStory.storyName = 'Complex List — Inset Variant'

export function ComplexListFullVariantStory(): JSX.Element {
  const StyledDiv = styled.div`
    ${sx}
  `
  return (
    <>
      <h1>Complex List</h1>
      <h2>Full Variant</h2>
      <ErsatzOverlay>
        <ActionList
          role="listbox"
          variant="full"
          groupMetadata={[
            {groupId: '0'},
            {groupId: '1', header: {title: 'Live query', variant: 'filled'}},
            {groupId: '2', header: {title: 'Layout', variant: 'subtle'}},
            {groupId: '3', renderItem: props => <ActionList.Item style={{fontWeight: 'bold'}} {...props} />},
            {
              groupId: '4',
              renderItem: ({leadingVisual: LeadingVisual, ...props}) => (
                <ActionList.Item
                  {...props}
                  leadingVisual={() => (
                    <StyledDiv sx={{'&>svg': {fill: 'white'}}}>
                      {LeadingVisual && <LeadingVisual></LeadingVisual>}
                    </StyledDiv>
                  )}
                />
              ),
              renderGroup: ({sx: sxProps, ...props}) => (
                <ActionList.Group {...props} sx={{...sxProps, backgroundColor: 'cornflowerblue', color: 'white'}} />
              )
            }
          ]}
          items={[
            {leadingVisual: TypographyIcon, text: 'Rename', groupId: '0', role: 'option'},
            {leadingVisual: VersionsIcon, text: 'Duplicate', groupId: '0', role: 'option'},
            {
              leadingVisual: SearchIcon,
              text: 'repo:github/memex,github/github',
              groupId: '1',
              role: 'option',
              renderItem: props => <ActionList.Item style={{color: 'rebeccapurple'}} {...props} />
            },
            {
              leadingVisual: NoteIcon,
              text: 'Table',
              description: 'Information-dense table optimized for operations across teams',
              descriptionVariant: 'block',
              groupId: '2',
              role: 'option'
            },
            {
              leadingVisual: ProjectIcon,
              text: 'Board',
              description: 'Kanban-style board focused on visual states',
              descriptionVariant: 'block',
              groupId: '2',
              role: 'option'
            },
            {
              leadingVisual: FilterIcon,
              text: 'Save sort and filters to current view',
              groupId: '3',
              role: 'option'
            },
            {leadingVisual: FilterIcon, text: 'Save sort and filters to new view', groupId: '3', role: 'option'},
            {leadingVisual: GearIcon, text: 'View settings', groupId: '4', role: 'option'}
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
      <ActionList.Header title="Layout" variant="filled" />
      <h2>Subtle Variant</h2>
      <ActionList.Header title="Layout" variant="subtle" />
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
          role="listbox"
          items={[
            {
              leadingVisual: ArrowRightIcon,
              children: <Label>Choose this one</Label>,
              trailingIcon: ArrowLeftIcon,
              role: 'option'
            }
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
CustomItemChildren.storyName = 'Custom Item Children'

export function SizeStressTestingStory(): JSX.Element {
  return (
    <>
      <h1>Size Stress Testing</h1>
      <ErsatzOverlay maxWidth="300px">
        <ActionList
          role="listbox"
          items={[
            {
              leadingVisual: ArrowRightIcon,
              text: 'Block Description.  Long text should wrap',
              description: 'This description is long, but it is block so it wraps',
              descriptionVariant: 'block',
              trailingVisual: ArrowLeftIcon,
              showDivider: true,
              role: 'option'
            },
            {
              leadingVisual: ArrowRightIcon,
              text: 'Inline Description',
              description: 'This description gets truncated because it is inline',
              trailingVisual: ArrowLeftIcon,
              showDivider: true,
              role: 'option'
            },
            {
              leadingVisual: ArrowRightIcon,
              text: 'Really long text without a description should wrap',
              trailingIcon: ArrowLeftIcon, // backward compatible
              showDivider: true,
              role: 'option'
            }
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
SizeStressTestingStory.storyName = 'Size Stress Testing'

type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode}
const ReactRouterLikeLink = forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, ...props}: {to: string; children: React.ReactNode}, ref) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a ref={ref} href={to} {...props} />
  }
)

const NextJSLikeLink = forwardRef(
  ({href, children}: {href: string; children: React.ReactNode}, ref): React.ReactElement => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href
    }
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  }
)

export function LinkItemStory(): JSX.Element {
  return (
    <>
      <h1>Simple List</h1>
      <ErsatzOverlay>
        <ActionList
          role="listbox"
          items={[
            {
              text: 'A. Vanilla action',
              role: 'option',
              renderItem: props => <ActionList.Item onAction={() => alert('hi?')} {...props} />
            },
            {
              text: 'B. Vanilla link',
              role: 'option',
              renderItem: props => <ActionList.Item as="a" href="/about" {...props} />
            },
            {
              text: 'C. React Router link',
              role: 'option',
              renderItem: props => <ActionList.Item as={ReactRouterLikeLink} to="/about" {...props} />
            },
            {
              text: 'D. NextJS style',
              role: 'option',
              renderItem: props => (
                <NextJSLikeLink href="/about">
                  <ActionList.Item as="a" {...props} />
                </NextJSLikeLink>
              )
            }
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
          role="listbox"
          items={[
            {
              text: 'One',
              role: 'option',
              onClick: () => alert('Hello')
            }
          ]}
        />
      </ErsatzOverlay>
    </>
  )
}
DOMPropsStory.storyName = 'List an item input including DOM props'
