import type React from 'react'
import type {Meta} from '@storybook/react-vite'
import {action} from 'storybook/actions'
import {BaseStyles, ThemeProvider} from '..'
import AvatarToken from './AvatarToken'
import type {AvatarTokenProps} from './AvatarToken'
import Text from '../Text'
import classes from './AvatarToken.stories.module.css'

export default {
  title: 'Components/AvatarToken',
  component: AvatarToken,
  args: {
    text: 'Mike Perrotti',
    avatarSrc: 'https://avatars.githubusercontent.com/mperrotti',
  },
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

const excludedControlKeys = ['id', 'as', 'tabIndex', 'onRemove']

const SingleExampleContainer: React.FC<React.PropsWithChildren<{label?: string}>> = ({children, label}) => (
  <div className={classes.SingleExampleContainer}>
    {label ? (
      <Text fontSize={0} color="fg.muted">
        {label}
      </Text>
    ) : null}
    {children}
  </div>
)

const ExampleCollectionContainer: React.FC<React.PropsWithChildren<unknown>> = ({children}) => (
  <div className={classes.ExampleCollectionContainer}>
    <Text fontSize={1} color="fg.subtle">
      Hint: use the &quot;Controls&quot; tab in the Addons panel to change the token properties
    </Text>
    {children}
  </div>
)

export const DefaultToken = (args: Omit<AvatarTokenProps, 'ref'>) => {
  return (
    <ExampleCollectionContainer>
      <AvatarToken {...args} />
    </ExampleCollectionContainer>
  )
}
DefaultToken.storyName = 'Default'
DefaultToken.parameters = {controls: {exclude: [...excludedControlKeys, 'hideRemoveButton']}}

export const Interactive = (args: Omit<AvatarTokenProps, 'ref' | 'text'>) => {
  return (
    <ExampleCollectionContainer>
      <div className={classes.InteractiveRow}>
        <AvatarToken as="a" href="http://google.com/" {...args} text="Link" />
        <AvatarToken as="button" onClick={action('clicked')} {...args} text="Button" />
        <AvatarToken as="span" tabIndex={0} onFocus={action('focused')} {...args} text="Focusable Span" />
      </div>
    </ExampleCollectionContainer>
  )
}
Interactive.parameters = {controls: {exclude: [...excludedControlKeys, 'hideRemoveButton', 'text']}}

export const WithOnRemoveFn = (args: Omit<AvatarTokenProps, 'ref'>) => {
  return (
    <ExampleCollectionContainer>
      <SingleExampleContainer label="w/ onRemove passed">
        <AvatarToken onRemove={action('remove me')} {...args} />
      </SingleExampleContainer>
      <SingleExampleContainer label="w/ onRemove passed and the token is interactive">
        <div className={classes.InteractiveRow}>
          <AvatarToken as="a" href="http://google.com/" onRemove={action('remove me')} {...args} text="Link" />
          <AvatarToken as="button" onClick={action('clicked')} onRemove={action('remove me')} {...args} text="Button" />
          <AvatarToken
            as="span"
            tabIndex={0}
            onFocus={action('focused')}
            onRemove={action('remove me')}
            {...args}
            text="Focusable Span"
          />
        </div>
      </SingleExampleContainer>
    </ExampleCollectionContainer>
  )
}
WithOnRemoveFn.parameters = {controls: {exclude: excludedControlKeys}}
