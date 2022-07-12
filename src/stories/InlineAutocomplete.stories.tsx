import React, {useState} from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, Box, Textarea, ThemeProvider, ActionList, Avatar, ActionListItemProps, FormControl} from '..'
import InlineAutocomplete, {ShowSuggestionsEvent, Suggestions} from '../InlineAutocomplete'

export default {
  title: 'Forms/InlineAutocomplete',
  component: InlineAutocomplete,
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Box paddingTop={5}>{Story()}</Box>
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    loading: {
      name: 'Loading',
      defaultValue: false,
      control: {
        type: 'boolean'
      }
    }
  }
} as Meta

interface User {
  login: string
  name: string
  avatar: string
  type: 'user' | 'organization'
}

const sampleUsers: User[] = [
  {login: 'monalisa', name: 'Monalisa Octocat', avatar: 'https://avatars.githubusercontent.com/github', type: 'user'},
  {login: 'primer', name: 'Primer', avatar: 'https://avatars.githubusercontent.com/primer', type: 'organization'},
  {login: 'github', name: 'GitHub', avatar: 'https://avatars.githubusercontent.com/github', type: 'organization'}
]

const UserSuggestion = ({user, ...props}: {user: User} & ActionListItemProps) => (
  <ActionList.Item {...props}>
    <ActionList.LeadingVisual>
      <Avatar src={user.avatar} square={user.type === 'organization'} />
    </ActionList.LeadingVisual>
    {user.name} <ActionList.Description>{user.login}</ActionList.Description>
  </ActionList.Item>
)

export const Default = ({loading}: {loading: boolean}) => {
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null)

  const onShowSuggestions = (event: ShowSuggestionsEvent) => {
    if (loading) {
      setSuggestions('loading')
      return
    }

    const filteredUsers = sampleUsers.filter(
      user =>
        user.login.toLowerCase().includes(event.query.toLowerCase()) ||
        user.name.toLowerCase().includes(event.query.toLowerCase())
    )
    setSuggestions(
      filteredUsers.map(user => ({
        value: user.login,
        render: props => <UserSuggestion user={user} {...props} />
      }))
    )
  }

  const onHideSuggestions = () => setSuggestions(null)

  return (
    <FormControl>
      <FormControl.Label>Inline Autocomplete Demo</FormControl.Label>
      <FormControl.Caption>Try typing &apos;@&apos; to show user suggestions.</FormControl.Caption>
      <InlineAutocomplete
        triggers={[{triggerChar: '@'}]}
        suggestions={suggestions}
        onShowSuggestions={onShowSuggestions}
        onHideSuggestions={onHideSuggestions}
      >
        <Textarea />
      </InlineAutocomplete>
    </FormControl>
  )
}
