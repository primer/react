import type React from 'react'
import LabelGroup from './LabelGroup'
import type {Meta, StoryFn} from '@storybook/react-vite'
import Token from '../Token/Token'
import Label from '../Label/Label'
import classes from './LabelGroup.stories.module.css'

const meta: Meta = {
  title: 'Components/LabelGroup/Features',
  component: LabelGroup,
}

const ResizableContainer = ({children, ...props}: {children: React.ReactNode}) => (
  <div className={classes.ResizableContainer} {...props}>
    {children}
  </div>
)

export const TruncateAuto: StoryFn = () => (
  <ResizableContainer>
    <LabelGroup visibleChildCount="auto">
      <Label>One</Label>
      <Label>Two</Label>
      <Label>Three</Label>
      <Label>Four</Label>
      <Label>Five</Label>
      <Label>Six</Label>
      <Label>Seven</Label>
      <Label>Eight</Label>
      <Label>Nine</Label>
      <Label>Ten</Label>
      <Label>Eleven</Label>
      <Label>Twelve</Label>
      <Label>Thirteen</Label>
      <Label>Fourteen</Label>
      <Label>Fifteen</Label>
      <Label>Sixteen</Label>
    </LabelGroup>
  </ResizableContainer>
)

export const TruncateAutoWithInteractiveTokens: StoryFn = () => (
  <ResizableContainer>
    <LabelGroup visibleChildCount="auto">
      <Token as="button" type="button" text="One" />
      <Token as="button" type="button" text="Two" />
      <Token as="button" type="button" text="Three" />
      <Token as="button" type="button" text="Four" />
      <Token as="button" type="button" text="Five" />
      <Token as="button" type="button" text="Six" />
      <Token as="button" type="button" text="Seven" />
      <Token as="button" type="button" text="Eight" />
      <Token as="button" type="button" text="Nine" />
      <Token as="button" type="button" text="Ten" />
      <Token as="button" type="button" text="Eleven" />
      <Token as="button" type="button" text="Twelve" />
      <Token as="button" type="button" text="Thirteen" />
      <Token as="button" type="button" text="Fourteen" />
      <Token as="button" type="button" text="Fifteen" />
      <Token as="button" type="button" text="Sixteen" />
    </LabelGroup>
  </ResizableContainer>
)

export const TruncateAfterFive: StoryFn = () => (
  <LabelGroup visibleChildCount={5}>
    <Label>One</Label>
    <Label>Two</Label>
    <Label>Three</Label>
    <Label>Four</Label>
    <Label>Five</Label>
    <Label>Six</Label>
    <Label>Seven</Label>
    <Label>Eight</Label>
    <Label>Nine</Label>
    <Label>Ten</Label>
    <Label>Eleven</Label>
    <Label>Twelve</Label>
    <Label>Thirteen</Label>
    <Label>Fourteen</Label>
    <Label>Fifteen</Label>
    <Label>Sixteen</Label>
  </LabelGroup>
)

export const TruncateAutoExpandInline: StoryFn = () => (
  <ResizableContainer>
    <LabelGroup visibleChildCount="auto" overflowStyle="inline">
      <Label>One</Label>
      <Label>Two</Label>
      <Label>Three</Label>
      <Label>Four</Label>
      <Label>Five</Label>
      <Label>Six</Label>
      <Label>Seven</Label>
      <Label>Eight</Label>
      <Label>Nine</Label>
      <Label>Ten</Label>
      <Label>Eleven</Label>
      <Label>Twelve</Label>
      <Label>Thirteen</Label>
      <Label>Fourteen</Label>
      <Label>Fifteen</Label>
      <Label>Sixteen</Label>
    </LabelGroup>
  </ResizableContainer>
)

export const TruncateAutoExpandInlineWithInteractiveTokens: StoryFn = () => (
  <ResizableContainer>
    <LabelGroup visibleChildCount="auto" overflowStyle="inline">
      <Token as="button" type="button" text="One" />
      <Token as="button" type="button" text="Two" />
      <Token as="button" type="button" text="Three" />
      <Token as="button" type="button" text="Four" />
      <Token as="button" type="button" text="Five" />
      <Token as="button" type="button" text="Six" />
      <Token as="button" type="button" text="Seven" />
      <Token as="button" type="button" text="Eight" />
      <Token as="button" type="button" text="Nine" />
      <Token as="button" type="button" text="Ten" />
      <Token as="button" type="button" text="Eleven" />
      <Token as="button" type="button" text="Twelve" />
      <Token as="button" type="button" text="Thirteen" />
      <Token as="button" type="button" text="Fourteen" />
      <Token as="button" type="button" text="Fifteen" />
      <Token as="button" type="button" text="Sixteen" />
    </LabelGroup>
  </ResizableContainer>
)

export default meta
