import React from 'react'
import {Meta} from '@storybook/react'
import {MentionIcon} from '@primer/octicons-react'
import {Box, Button, IssueLabelToken, Tooltip} from '../..'

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
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginY: '60px',
        marginX: '400px', // make room for tooltips
        '[data-component=tooltip]': {visibility: 'visible'} // see all tooltips
      }}
    >
      <Tooltip direction="nw" text="Tooltip text can be really long and even take mutiple lines">
        <IssueLabel text="direction: nw" fillColor="#0366d6" />
      </Tooltip>
      <Tooltip direction="n" text="Tooltip text can be really long and even take mutiple lines">
        <IssueLabel text="direction: n" fillColor="#0366d6" />
      </Tooltip>
      <Tooltip direction="ne" text="Tooltip text can be really long and even take mutiple lines">
        <IssueLabel text="direction: ne" fillColor="#0366d6" />
      </Tooltip>

      <Tooltip direction="w" text="Tooltip text can be really long and even take mutiple lines">
        <IssueLabel text="direction: w" fillColor="#0366d6" />
      </Tooltip>
      <Tooltip direction="e" text="Tooltip text can be really long and even take mutiple lines">
        <IssueLabel text="direction: e" fillColor="#0366d6" />
      </Tooltip>

      <Tooltip direction="sw" text="Tooltip text can be really long and even take mutiple lines">
        <IssueLabel text="direction: sw" fillColor="#0366d6" />
      </Tooltip>
      <Tooltip direction="s" text="Tooltip text can be really long and even take mutiple lines">
        <IssueLabel text="direction: s" fillColor="#0366d6" />
      </Tooltip>
      <Tooltip direction="se" text="Tooltip text can be really long and even take mutiple lines">
        <IssueLabel text="direction: se" fillColor="#0366d6" />
      </Tooltip>
    </Box>
  )
}

export const Delay = () => {
  return (
    <Box sx={{display: 'flex', gap: 1}}>
      <Tooltip text="Waits 400ms before showing up">
        <Button>default, with delay</Button>
      </Tooltip>
      <Tooltip text="Shows up instantly" noDelay>
        <Button>no delay</Button>
      </Tooltip>
    </Box>
  )
}

export const TypeLabel = () => {
  return (
    <Tooltip type="label" text="This label is attached with aria-labelledby instead of describedby">
      <button>
        <MentionIcon />
      </button>
    </Tooltip>
  )
}

export const AcceptsSx = () => {
  return (
    <Tooltip text="Please dont actually do this" sx={{fontSize: 4}}>
      <Button>Tooltip accepts sx prop</Button>
    </Tooltip>
  )
}

export const BackwardCompatibility = () => {
  return (
    <Box sx={{display: 'flex', gap: 1}}>
      <Tooltip aria-label="Tooltip text">
        <Button>Has tooltip with aria-label</Button>
      </Tooltip>
      <Tooltip align="right" text="wrap doesn't do anything, but shouldn't break either">
        <Button>Has tooltip with align:right</Button>
      </Tooltip>
      <Tooltip wrap text="wrap doesn't do anything, but shouldn't break either">
        <Button>Has tooltip with wrap</Button>
      </Tooltip>
    </Box>
  )
}
