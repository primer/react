import React from 'react'
import {Meta} from '@storybook/react'
import {CodeIcon, CrossReferenceIcon, ImageIcon, MentionIcon} from '@primer/octicons-react'
import {IconButton, Box, IssueLabelToken, Tooltip} from '../..'

export default {title: 'Composite components/Tooltip/examples', component: Tooltip} as Meta

const IssueLabel = React.forwardRef<HTMLAnchorElement, {text: string; fillColor: string}>(({text, fillColor}, ref) => {
  return (
    <IssueLabelToken
      as="a"
      href={`https://github.com/primer/react/issues?q:label:${text}`}
      target="_blank"
      ref={ref}
      text={text}
      fillColor={fillColor}
    />
  )
})

export const TokenWithTooltip = () => {
  return (
    <Box data-chromatic sx={{display: 'flex', gap: 1}}>
      <Tooltip text="Something isn't working">
        <IssueLabel text="bug" fillColor="#d73a4a" />
      </Tooltip>
      <Tooltip text="a vibrant hub of collaboration">
        <IssueLabel text="collab" fillColor="#FFD2ED" />
      </Tooltip>
      <Tooltip text="Someone or something is preventing this from moving forward">
        <IssueLabel text="blocked" fillColor="#86181d" />
      </Tooltip>
      <Tooltip text="Pull requests that update a dependency file">
        <IssueLabel text="dependencies" fillColor="#0366d6" />
      </Tooltip>
    </Box>
  )
}

export const ButtonWithTooltip = () => {
  return (
    <Box sx={{display: 'flex', gap: 1}}>
      <Tooltip text="Add code, <Cmd+e>">
        <IconButton variant="invisible" icon={CodeIcon} aria-label="Code" />
      </Tooltip>
      <Tooltip text="Directly mention a team or user">
        <IconButton variant="invisible" icon={MentionIcon} aria-label="Mention" />
      </Tooltip>
      <Tooltip text="Reference an issue, pull request, or discussion">
        <IconButton
          variant="invisible"
          icon={CrossReferenceIcon}
          aria-label="Issue, pull request, or discussion reference"
        />
      </Tooltip>
      <Tooltip text="Attach an image or video">
        <IconButton variant="invisible" icon={ImageIcon} aria-label="Image" />
      </Tooltip>
    </Box>
  )
}
