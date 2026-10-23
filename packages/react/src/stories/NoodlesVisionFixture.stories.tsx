import React from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {expect, userEvent, within} from 'storybook/test'
import {ActionList, ActionMenu, BaseStyles, IconButton} from '..'
import {ThemeProvider} from '../next'
import {
  BookIcon,
  CommentIcon,
  FileDirectoryIcon,
  FileIcon,
  GearIcon,
  KebabHorizontalIcon,
  SearchIcon,
} from '@primer/octicons-react'
import {noodlesTheme} from './noodlesTheme'
import classes from './NoodlesVisionFixture.stories.module.css'

type Appearance = 'primer' | 'noodles'

interface WorkspaceProps {
  appearance: Appearance
}

function Workspace({appearance}: WorkspaceProps) {
  const isNoodles = appearance === 'noodles'
  const [archived, setArchived] = React.useState(false)
  const documentId = `${appearance}-quarterly-priorities`

  return (
    <ThemeProvider theme={isNoodles ? noodlesTheme : undefined} colorMode="night">
      <div className={classes.Scope} data-testid={`${appearance}-workspace`} data-appearance={appearance}>
        <BaseStyles className={classes.Frame}>
          <aside className={classes.Sidebar}>
            <div className={classes.Brand}>
              <span className={classes.BrandMark} aria-hidden="true">
                P
              </span>
              <span>
                <span className={classes.BrandName}>Primer</span>
                <span className={classes.BrandCaption}>Workspace</span>
              </span>
              <IconButton
                aria-label="Workspace options"
                icon={GearIcon}
                size="small"
                variant="invisible"
                className={classes.SidebarAction}
              />
            </div>

            <nav aria-label="Workspace navigation" className={classes.Navigation}>
              <ActionList variant="full" className={classes.NavigationList}>
                <ActionList.LinkItem href={`#${documentId}`} active aria-current="page" size="small">
                  <ActionList.LeadingVisual>
                    <FileDirectoryIcon />
                  </ActionList.LeadingVisual>
                  Quarterly priorities
                </ActionList.LinkItem>
                <ActionList.LinkItem href={`#${appearance}-focus`} size="small">
                  <ActionList.LeadingVisual>
                    <FileIcon />
                  </ActionList.LeadingVisual>
                  Project notes
                </ActionList.LinkItem>
                <ActionList.LinkItem href={`#${appearance}-next-steps`} size="small">
                  <ActionList.LeadingVisual>
                    <BookIcon />
                  </ActionList.LeadingVisual>
                  Planning guide
                </ActionList.LinkItem>
              </ActionList>
            </nav>

            <div className={classes.SidebarFooter}>
              <span className={classes.Avatar} aria-hidden="true">
                S
              </span>
              <span className={classes.FooterName}>Sam Smolenski</span>
              <IconButton
                aria-label="Profile options"
                icon={KebabHorizontalIcon}
                size="small"
                variant="invisible"
                className={classes.SidebarAction}
              />
            </div>
          </aside>

          <main className={classes.Main}>
            <header className={classes.Toolbar}>
              <span className={classes.Breadcrumb}>Documents / Quarterly priorities</span>
              <div className={classes.ToolbarActions}>
                <IconButton aria-label="Search document" icon={SearchIcon} size="small" variant="invisible" />
                <IconButton aria-label="Open comments" icon={CommentIcon} size="small" variant="invisible" />
                <ActionMenu>
                  <ActionMenu.Button
                    aria-label="Document actions"
                    icon={KebabHorizontalIcon}
                    size="small"
                    variant="invisible"
                    trailingAction={null}
                  />
                  <ActionMenu.Overlay width="small">
                    <ActionList>
                      <ActionList.Item onSelect={() => setArchived(value => !value)}>
                        {archived ? 'Restore document' : 'Archive document'}
                      </ActionList.Item>
                    </ActionList>
                  </ActionMenu.Overlay>
                </ActionMenu>
              </div>
            </header>

            <article className={classes.Document} id={documentId} aria-labelledby={`${documentId}-title`}>
              <p className={classes.Eyebrow}>Product planning</p>
              <h3 className={classes.DocumentTitle} id={`${documentId}-title`}>
                Quarterly priorities
              </h3>
              <p className={classes.DocumentMeta}>Updated today · 8 min read</p>
              {archived ? (
                <p className={classes.Status} role="status">
                  Document archived
                </p>
              ) : null}

              <section
                className={classes.DocumentSection}
                id={`${appearance}-focus`}
                aria-labelledby={`${documentId}-focus`}
              >
                <h4 id={`${documentId}-focus`}>Focus</h4>
                <p>
                  Make everyday work feel clear and unhurried. Prioritize the details that help teams understand what
                  matters now and what can wait.
                </p>
                <ul>
                  <li className={classes.DocumentListItem}>
                    Bring the most useful project context into one calm workspace.
                  </li>
                  <li className={classes.DocumentListItem}>
                    Keep navigation compact and make important actions easy to find.
                  </li>
                </ul>
              </section>

              <section
                className={classes.DocumentSection}
                id={`${appearance}-next-steps`}
                aria-labelledby={`${documentId}-next-steps`}
              >
                <h4 id={`${documentId}-next-steps`}>Next steps</h4>
                <p>
                  Share an early direction with the team, gather feedback, and refine the parts that make the experience
                  feel personal without getting in the way.
                </p>
              </section>
            </article>
          </main>
        </BaseStyles>
      </div>
    </ThemeProvider>
  )
}

function NoodlesVisionFixture() {
  return (
    <div className={classes.Story}>
      <div className={classes.Comparison}>
        <section className={classes.Preview} aria-labelledby="primer-appearance-title">
          <h2 className={classes.PreviewTitle} id="primer-appearance-title">
            Primer defaults (dark)
          </h2>
          <Workspace appearance="primer" />
        </section>
        <section className={classes.Preview} aria-labelledby="noodles-appearance-title">
          <h2 className={classes.PreviewTitle} id="noodles-appearance-title">
            Noodles theme (dark)
          </h2>
          <Workspace appearance="noodles" />
        </section>
      </div>
    </div>
  )
}

const meta = {
  title: 'Examples/Noodles Vision Fixture',
  component: NoodlesVisionFixture,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NoodlesVisionFixture>

export default meta

type Story = StoryObj<typeof meta>

export const Comparison: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const noodlesWorkspace = canvas.getByTestId('noodles-workspace')
    const primerColorMode = canvas.getByTestId('primer-workspace').closest('[data-color-mode]')
    const noodlesColorMode = noodlesWorkspace.closest('[data-color-mode]')
    if (!primerColorMode || !noodlesColorMode) {
      throw new Error('ThemeProvider color-mode scopes were not rendered')
    }
    const noodles = within(noodlesWorkspace)
    const portal = within(canvasElement.ownerDocument.body)
    await expect(noodles.getByRole('link', {name: 'Quarterly priorities'})).toHaveAttribute('aria-current', 'page')
    await expect(primerColorMode).toHaveAttribute('data-color-mode', 'dark')
    await expect(noodlesColorMode).toHaveAttribute('data-color-mode', 'dark')
    const actionButton = noodles.getByRole('button', {name: 'Document actions'})

    await userEvent.click(actionButton)
    const archiveAction = portal.getByRole('menuitem', {name: 'Archive document'})
    await expect(archiveAction).toHaveFocus()
    await expect(archiveAction.closest('[data-primer-theme]')).toHaveAttribute('data-primer-theme', 'noodles')
    await expect(noodlesWorkspace.closest('[data-color-mode="dark"]')).not.toBeNull()

    await userEvent.keyboard('{Escape}')
    await expect(actionButton).toHaveFocus()
    await expect(portal.queryByRole('menu')).not.toBeInTheDocument()

    await userEvent.keyboard('{Enter}')
    await expect(portal.getByRole('menuitem', {name: 'Archive document'})).toHaveFocus()
    await expect(
      portal.getByRole('menuitem', {name: 'Archive document'}).closest('[data-primer-theme]'),
    ).toHaveAttribute('data-primer-theme', 'noodles')
    await userEvent.keyboard('{Escape}')
    await expect(actionButton).toHaveFocus()

    await userEvent.click(actionButton)
    await userEvent.keyboard('{Enter}')
    await expect(actionButton).toHaveFocus()
    await expect(noodles.getByRole('status')).toHaveTextContent('Document archived')

    await userEvent.click(actionButton)
    await userEvent.keyboard('{Enter}')
    await expect(actionButton).toHaveFocus()
    await expect(noodles.queryByRole('status')).not.toBeInTheDocument()
  },
}
