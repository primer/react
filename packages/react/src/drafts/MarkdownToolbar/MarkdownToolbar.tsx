import React from 'react'
import {useId} from '../../hooks/useId'
import type {ComponentProps} from '../../utils/types'
import createComponent from '../../utils/custom-element'
import type {ButtonProps} from '../../Button'
import {Tooltip} from '../../TooltipV2'
import ActionBar from '../ActionBar'
import {
  MentionIcon,
  CrossReferenceIcon,
  HeadingIcon,
  BoldIcon,
  ItalicIcon,
  PaperclipIcon,
  QuoteIcon,
  CodeIcon,
  LinkIcon,
  ListOrderedIcon,
  ListUnorderedIcon,
  StrikethroughIcon,
  TasklistIcon,
} from '@primer/octicons-react'
import MarkdownToolbarElement from '@github/markdown-toolbar-element'

const MarkdownToolbarComponent = createComponent(MarkdownToolbarElement, 'markdown-toolbar')
MarkdownToolbarComponent.displayName = 'MarkdownToolbar'

export interface MarkdownToolbarProps extends ComponentProps<typeof MarkdownToolbarComponent> {
  for: string
}

function MarkdownToolbar({children, ...props}: MarkdownToolbarProps) {
  return (
    <MarkdownToolbarComponent {...props}>
      <ActionBar>{children}</ActionBar>
    </MarkdownToolbarComponent>
  )
}

export type MarkdownButtonProps = {
  label: string
  icon: React.ElementType
  md:
    | 'header-1'
    | 'header-2'
    | 'header-3'
    | 'header-4'
    | 'header-5'
    | 'header-6'
    | 'bold'
    | 'italic'
    | 'quote'
    | 'code'
    | 'link'
    | 'image'
    | 'unordered-list'
    | 'ordered-list'
    | 'task-list'
    | 'mention'
    | 'ref'
    | 'strikethrough'
} & Omit<ButtonProps, 'aria-label' | 'aria-labelledby'>

function MarkdownButton({label, md, ...props}: MarkdownButtonProps) {
  const id = useId()
  return (
    <Tooltip id={id} text={label} type="label">
      <ActionBar.IconButton aria-labelledby={id} variant="invisible" {...props} data-md-button={md} />
    </Tooltip>
  )
}

export type SpecificMarkdownButtonProps = {
  label?: string
  icon?: React.ElementType
} & Omit<MarkdownButtonProps, 'md' | 'label' | 'icon'>

function Header1Button(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Header" icon={HeadingIcon} {...props} md="header-1" />
}

function Header2Button(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Header" icon={HeadingIcon} {...props} md="header-2" />
}

function Header3Button(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Header" icon={HeadingIcon} {...props} md="header-3" />
}

function BoldButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Bold" icon={BoldIcon} {...props} md="bold" />
}

function ItalicButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Italic" icon={ItalicIcon} {...props} md="italic" />
}

function QuoteButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Quote" icon={QuoteIcon} {...props} md="quote" />
}

function CodeButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Code" icon={CodeIcon} {...props} md="code" />
}

function LinkButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Link" icon={LinkIcon} {...props} md="link" />
}

function ImageButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Attach files" icon={PaperclipIcon} {...props} md="image" />
}

function UnorderedListButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Unordered list" icon={ListUnorderedIcon} {...props} md="unordered-list" />
}

function OrderedListButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Numbered list" icon={ListOrderedIcon} {...props} md="ordered-list" />
}

function TaskListButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Task list" icon={TasklistIcon} {...props} md="task-list" />
}

function MentionButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Mention" icon={MentionIcon} {...props} md="mention" />
}

function ReferenceButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Reference" icon={CrossReferenceIcon} {...props} md="ref" />
}

function StrikethroughButton(props: SpecificMarkdownButtonProps) {
  return <MarkdownButton label="Strikethrough" icon={StrikethroughIcon} {...props} md="strikethrough" />
}

function InlineFormattingButtons() {
  return (
    <>
      <Header3Button />
      <BoldButton />
      <ItalicButton />
      <QuoteButton />
      <CodeButton />
      <LinkButton />
    </>
  )
}

function ListButtons() {
  return (
    <>
      <OrderedListButton />
      <UnorderedListButton />
      <TaskListButton />
    </>
  )
}

function DefaultButtons() {
  return (
    <>
      <InlineFormattingButtons />

      <ActionBar.Divider />

      <ListButtons />

      <ActionBar.Divider />

      <MentionButton />
      <ReferenceButton />
    </>
  )
}

export default Object.assign(MarkdownToolbar, {
  Header1Button,
  Header2Button,
  Header3Button,
  BoldButton,
  ItalicButton,
  QuoteButton,
  CodeButton,
  LinkButton,
  ImageButton,
  UnorderedListButton,
  OrderedListButton,
  TaskListButton,
  MentionButton,
  ReferenceButton,
  StrikethroughButton,
  DefaultButtons,
  InlineFormattingButtons,
  ListButtons,

  Button: MarkdownButton,
  Divider: ActionBar.Divider,
})
