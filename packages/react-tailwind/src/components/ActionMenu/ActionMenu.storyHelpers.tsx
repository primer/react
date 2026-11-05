import {ArchiveIcon, BookIcon, CommentIcon, CopyIcon, GearIcon, RocketIcon, WorkflowIcon} from '@primer/octicons-react'
import {ActionMenu} from './ActionMenu'

interface CommentActionsProps {
  /** Called with the activated action's name. */
  onAction?: (name: string) => void
  /** Adds a "View file" link before the destructive action. */
  viewFile?: boolean
}

/** Comment actions shared by the anchored, controlled, and context menu examples. */
export function CommentActions({onAction, viewFile = false}: CommentActionsProps) {
  return (
    <>
      <ActionMenu.Item onClick={() => onAction?.('Copy link')}>
        Copy link
        <ActionMenu.TrailingVisual>⌘C</ActionMenu.TrailingVisual>
      </ActionMenu.Item>
      <ActionMenu.Item onClick={() => onAction?.('Quote reply')}>
        Quote reply
        <ActionMenu.TrailingVisual>⌘Q</ActionMenu.TrailingVisual>
      </ActionMenu.Item>
      <ActionMenu.Item onClick={() => onAction?.('Edit comment')}>
        Edit comment
        <ActionMenu.TrailingVisual>⌘E</ActionMenu.TrailingVisual>
      </ActionMenu.Item>
      {viewFile ? <ActionMenu.LinkItem href="#">View file</ActionMenu.LinkItem> : null}
      <ActionMenu.Divider />
      <ActionMenu.Item variant="danger" onClick={() => onAction?.('Delete file')}>
        Delete file
        <ActionMenu.TrailingVisual>⌘D</ActionMenu.TrailingVisual>
      </ActionMenu.Item>
    </>
  )
}

interface ProjectActionsProps {
  /** Marks every action unavailable with this explanation. */
  inactiveText?: string
  /** Called with the activated action's name. */
  onAction?: (name: string) => void
}

/** Project actions mixing buttons with a settings link. */
export function ProjectActions({inactiveText, onAction}: ProjectActionsProps) {
  return (
    <>
      <ActionMenu.Item inactiveText={inactiveText} onClick={() => onAction?.('Workflows')}>
        <ActionMenu.LeadingVisual>
          <WorkflowIcon />
        </ActionMenu.LeadingVisual>
        Workflows
      </ActionMenu.Item>
      <ActionMenu.Item inactiveText={inactiveText} onClick={() => onAction?.('Archived items')}>
        <ActionMenu.LeadingVisual>
          <ArchiveIcon />
        </ActionMenu.LeadingVisual>
        Archived items
      </ActionMenu.Item>
      <ActionMenu.LinkItem href="/" inactiveText={inactiveText}>
        <ActionMenu.LeadingVisual>
          <GearIcon />
        </ActionMenu.LeadingVisual>
        Settings
      </ActionMenu.LinkItem>
      <ActionMenu.Item inactiveText={inactiveText} onClick={() => onAction?.('Make a copy')}>
        <ActionMenu.LeadingVisual>
          <CopyIcon />
        </ActionMenu.LeadingVisual>
        Make a copy
      </ActionMenu.Item>
    </>
  )
}

interface GitHubProjectsGroupProps {
  /** Group label text. */
  heading: string
  /** Marks every link unavailable with this explanation. */
  inactiveText?: string
}

/** A divider followed by a labelled group of GitHub project links. */
export function GitHubProjectsGroup({heading, inactiveText}: GitHubProjectsGroupProps) {
  return (
    <>
      <ActionMenu.Divider />
      <ActionMenu.Group>
        <ActionMenu.GroupLabel>{heading}</ActionMenu.GroupLabel>
        <ActionMenu.LinkItem href="/" inactiveText={inactiveText}>
          <ActionMenu.LeadingVisual>
            <RocketIcon />
          </ActionMenu.LeadingVisual>
          What&apos;s new
        </ActionMenu.LinkItem>
        <ActionMenu.LinkItem href="/" inactiveText={inactiveText}>
          <ActionMenu.LeadingVisual>
            <CommentIcon />
          </ActionMenu.LeadingVisual>
          Give feedback
        </ActionMenu.LinkItem>
        <ActionMenu.LinkItem href="/" inactiveText={inactiveText}>
          <ActionMenu.LeadingVisual>
            <BookIcon />
          </ActionMenu.LeadingVisual>
          GitHub Docs
        </ActionMenu.LinkItem>
      </ActionMenu.Group>
    </>
  )
}
