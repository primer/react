import {
  AgentIcon,
  CheckCircleFillIcon,
  ChevronRightIcon,
  GearIcon,
  IssueOpenedIcon,
  RepoIcon,
} from '@primer/octicons-react'
import type {ReactNode} from 'react'
import {Button} from '../../Button'
import {ActionList} from '../../ActionList'
import Link from '../../Link'
import Spinner from '../../Spinner'
import IssueLabelToken from '../../Token/IssueLabelToken'
import {CustomLayoutExample} from '../SelectPanel.composition.stories'
import classes from './SelectPanelFilm.module.css'

export function SelectPanelFilmIssue({
  time = 0,
  children,
  mobile = false,
}: {
  time?: number
  children?: ReactNode
  mobile?: boolean
}) {
  return (
    <div className={classes.Issue} data-film-issue data-mobile={mobile}>
      <header className={classes.RepositoryHeader} data-film-backdrop>
        <RepoIcon size={20} />{' '}
        <span>
          primer / <strong>react</strong>
        </span>
        <nav aria-label="Repository">Code &nbsp;&nbsp; Issues &nbsp;&nbsp; Pull requests &nbsp;&nbsp; Discussions</nav>
      </header>
      <div className={classes.IssueHeading} data-film-backdrop>
        <h1>
          Breadcrumbs: &quot;Maximum update depth exceeded&quot; with multi-part crumbs
          <span> #8790</span>
        </h1>
        <div className={classes.IssueMeta}>
          <span className={classes.OpenBadge}>
            <IssueOpenedIcon /> Open
          </span>
          <span>
            <strong>MattFor</strong> opened this issue
          </span>
        </div>
        {!children ? (
          <div className={classes.ListSource} aria-hidden="true">
            <ActionList data-film-list-source>
              <ActionList.Item>Item one</ActionList.Item>
              <ActionList.Item>Item two</ActionList.Item>
              <ActionList.Item>Item three</ActionList.Item>
            </ActionList>
            <ActionList className={classes.StatusSource} data-film-status-source data-film-status-active="false">
              {[
                {name: 'Architect', state: 'done'},
                {name: 'Developer', state: 'working'},
                {name: 'Accessibility Reviewer', state: 'queued'},
              ].map((agent, index) => (
                <ActionList.Item key={agent.name}>
                  <span className={classes.StatusGeneric}>Item {['one', 'two', 'three'][index]}</span>
                  <span className={classes.StatusSpecific}>{agent.name}</span>
                  <ActionList.TrailingVisual>
                    <span className={classes.StatusPreview} data-state={agent.state}>
                      <span className={classes.StatusGeneric}>
                        <ChevronRightIcon size={16} />
                      </span>
                      <span className={classes.StatusSpecific}>
                        {agent.state === 'done' ? (
                          <CheckCircleFillIcon size={16} />
                        ) : agent.state === 'working' ? (
                          <Spinner size="small" srText={null} className={classes.StatusPreviewSpinner} />
                        ) : (
                          <span className={classes.QueuedStatusPreview} />
                        )}
                      </span>
                    </span>
                  </ActionList.TrailingVisual>
                </ActionList.Item>
              ))}
            </ActionList>
          </div>
        ) : null}
      </div>
      <div className={classes.IssueColumns}>
        <article className={classes.IssueBody} data-film-backdrop>
          <header>
            <strong>MattFor</strong> commented
          </header>
          <div>
            <h2>Description</h2>
            <p>
              Breadcrumbs with <code>overflow=&quot;menu&quot;</code> can flip between its plain and menu layouts until
              React throws &quot;Maximum update depth exceeded&quot;.
            </p>
            <h2>Steps to reproduce</h2>
            <pre>
              <code>
                {
                  // eslint-disable-next-line github/unescaped-html-literal -- React renders this code example as escaped text.
                  '<Breadcrumbs overflow="menu">\n  <Breadcrumbs.Item>organization</Breadcrumbs.Item>\n  <CrumbWithPicker />\n</Breadcrumbs>'
                }
              </code>
            </pre>
            <h2>Version</h2>
            <p>38.46.0 / main</p>
            <h2>Browser</h2>
            <p>Edge, Firefox, Safari, Chrome</p>
          </div>
        </article>
        <aside className={classes.IssueSidebar} aria-label="Issue sidebar">
          <section className={classes.SidebarSection} data-film-backdrop>
            <h3>
              <Button
                variant="invisible"
                trailingAction={GearIcon}
                className={classes.SidebarHeading}
                aria-label="Edit assignees"
              >
                Assignees
              </Button>
            </h3>
            <div className={classes.SidebarContent} data-assignees>
              <span>
                No one -{' '}
                <Link inline href="https://github.com/primer/react/issues/8790">
                  Assign yourself
                </Link>
              </span>
              {!children ? (
                <Button block size="small" leadingVisual={AgentIcon}>
                  Assign to Agent
                </Button>
              ) : null}
            </div>
          </section>
          {children ? <section className={classes.SidebarSection}>{children}</section> : null}
          <section className={classes.SidebarSection} data-film-backdrop-border>
            <div className={classes.LabelPicker}>
              <CustomLayoutExample
                transactional
                open={time >= 1_200}
                focusTrapSettings={{disabled: true}}
                renderTrigger={props => (
                  <h3>
                    <Button {...props} variant="invisible" trailingAction={GearIcon} className={classes.SidebarHeading}>
                      Labels
                    </Button>
                  </h3>
                )}
              />
            </div>
            <div className={classes.SidebarContent} data-film-backdrop>
              <IssueLabelToken text="bug" fillColor="#d73a4a" />
            </div>
          </section>
          {[
            {title: 'Type', content: 'No type'},
            {
              title: 'Fields',
              content: (
                <div className={classes.PriorityRow}>
                  <span>Priority</span>
                  <Button variant="invisible" className={classes.PriorityValue}>
                    Choose an option
                  </Button>
                </div>
              ),
            },
            {title: 'Projects', content: 'No projects'},
            {title: 'Milestone', content: 'No milestone'},
            {title: 'Relationships', content: 'None yet'},
            {
              title: 'Development',
              content: (
                <span>
                  <Link inline href="https://github.com/primer/react/issues/8790">
                    Create a branch
                  </Link>{' '}
                  for this issue or link a pull request.
                </span>
              ),
            },
          ].map(({title, content}) => (
            <section key={title} className={classes.SidebarSection} data-film-backdrop>
              <h3>
                <Button
                  variant="invisible"
                  trailingAction={GearIcon}
                  className={classes.SidebarHeading}
                  aria-label={`Edit ${title.toLowerCase()}`}
                >
                  {title}
                </Button>
              </h3>
              <div className={classes.SidebarContent}>{content}</div>
            </section>
          ))}
        </aside>
      </div>
    </div>
  )
}
