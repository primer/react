import React from 'react'
import {Meta} from '@storybook/react'
import {Box, IssueLabelToken} from '..'
import {Tooltip} from '.'

export default {title: 'Composite components/Tooltip/fixtures', component: Tooltip} as Meta

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

export const Direction = () => {
  return (
    <Box
      sx={{
        m: 10,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 4
      }}
    >
      <Tooltip direction="nw" text="Tooltip text">
        <IssueLabel text="direction: nw" fillColor="#0366d6" />
      </Tooltip>
      <Tooltip direction="n" text="Tooltip text">
        <IssueLabel text="direction: n" fillColor="#0366d6" />
      </Tooltip>
      <Tooltip direction="ne" text="Tooltip text">
        <IssueLabel text="direction: ne" fillColor="#0366d6" />
      </Tooltip>

      <Tooltip direction="w" text="Tooltip text">
        <IssueLabel text="direction: w" fillColor="#0366d6" />
      </Tooltip>
      <span />
      <Tooltip direction="e" text="Tooltip text">
        <IssueLabel text="direction: e" fillColor="#0366d6" />
      </Tooltip>

      <Tooltip direction="sw" text="Tooltip text">
        <IssueLabel text="direction: sw" fillColor="#0366d6" />
      </Tooltip>
      <Tooltip direction="s" text="Tooltip text">
        <IssueLabel text="direction: s" fillColor="#0366d6" />
      </Tooltip>
      <Tooltip direction="se" text="Tooltip text">
        <IssueLabel text="direction: se" fillColor="#0366d6" />
      </Tooltip>
    </Box>
  )
}
