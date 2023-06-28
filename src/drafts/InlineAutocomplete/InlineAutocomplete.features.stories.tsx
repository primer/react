import React, {useState} from 'react'
import {Meta} from '@storybook/react'
import {ActionList, Avatar, ActionListItemProps, Textarea, TextInput, FormControl} from '../..'
import InlineAutocomplete, {ShowSuggestionsEvent, Suggestions} from '.'

export default {
  title: 'Components/Forms/InlineAutocomplete/Features',
  component: InlineAutocomplete,
} as Meta<typeof InlineAutocomplete>

interface User {
  login: string
  name: string
  avatar: string
  type: 'user' | 'organization'
}

const sampleUsers: User[] = [
  {login: 'monalisa', name: 'Monalisa Octocat', avatar: 'https://avatars.githubusercontent.com/github', type: 'user'},
  {login: 'primer', name: 'Primer', avatar: 'https://avatars.githubusercontent.com/primer', type: 'organization'},
  {login: 'github', name: 'GitHub', avatar: 'https://avatars.githubusercontent.com/github', type: 'organization'},
]

const filteredUsers = (query: string) =>
  sampleUsers.filter(
    user =>
      user.login.toLowerCase().includes(query.toLowerCase()) || user.name.toLowerCase().includes(query.toLowerCase()),
  )

export const SingleLine = ({loading, tabInserts}: ArgProps) => {
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null)

  const onShowSuggestions = (event: ShowSuggestionsEvent) => {
    if (loading) {
      setSuggestions('loading')
      return
    }

    setSuggestions(filteredUsers(event.query).map(user => user.login))
  }

  return (
    <FormControl>
      <FormControl.Label>Inline Autocomplete Demo</FormControl.Label>
      <FormControl.Caption>Try typing &apos;@&apos; to show user suggestions.</FormControl.Caption>
      <InlineAutocomplete
        triggers={[{triggerChar: '@'}]}
        suggestions={suggestions}
        onShowSuggestions={onShowSuggestions}
        onHideSuggestions={() => setSuggestions(null)}
        tabInsertsSuggestions={tabInserts}
      >
        <TextInput sx={{lineHeight: 1.2}} />
      </InlineAutocomplete>
    </FormControl>
  )
}

const UserSuggestion = ({user, ...props}: {user: User} & ActionListItemProps) => (
  <ActionList.Item {...props}>
    <ActionList.LeadingVisual>
      <Avatar src={user.avatar} square={user.type === 'organization'} />
    </ActionList.LeadingVisual>
    {user.name} <ActionList.Description>{user.login}</ActionList.Description>
  </ActionList.Item>
)

type ArgProps = {
  loading: boolean
  tabInserts: boolean
}

export const CustomRendering = ({loading, tabInserts}: ArgProps) => {
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null)

  const onShowSuggestions = (event: ShowSuggestionsEvent) => {
    if (loading) {
      setSuggestions('loading')
      return
    }

    setSuggestions(
      filteredUsers(event.query).map(user => ({
        value: user.login,
        render: props => <UserSuggestion user={user} {...props} />,
      })),
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
        tabInsertsSuggestions={tabInserts}
      >
        <Textarea />
      </InlineAutocomplete>
    </FormControl>
  )
}
