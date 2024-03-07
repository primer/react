import {Banner} from '../Banner'
import {action} from '@storybook/addon-actions'
import Link from '../Link'
import type {Meta} from '@storybook/react'
import {Status} from '../internal/components/Status'
import {Alert} from '../internal/components/Alert'
import FormControl from '../FormControl'
import RadioGroup from '../RadioGroup'
import Radio from '../Radio'
import {Button} from '../Button'
import React from 'react'
import {useFocus} from '../internal/hooks/useFocus'

const meta = {
  title: 'Drafts/Components/Banner/Examples',
  component: Banner,
} satisfies Meta<typeof Banner>

export default meta

export const WithUserAction = () => {
  const [hasError, setHasError] = React.useState(false)
  const bannerRef = React.useRef<React.ElementRef<typeof Banner>>(null)
  const focus = useFocus()

  return (
    <>
      {hasError ? (
        <Banner ref={bannerRef} variant="critical">
          <Banner.Content>
            <Banner.Title>Error</Banner.Title>
            <Banner.Description>
              <Alert>Something went wrong. Please try again later.</Alert>
            </Banner.Description>
          </Banner.Content>
        </Banner>
      ) : null}
      <Button
        type="button"
        onClick={() => {
          setHasError(true)
          focus(bannerRef)
        }}
      >
        Update profile
      </Button>
    </>
  )
}

export const WithDynamicContent = () => {
  type Choice = 'one' | 'two' | 'three'
  const messages: Map<Choice, string> = new Map([
    ['one', 'This is a message for choice one'],
    ['two', 'This is a message for choice two'],
    ['three', 'This is a message for choice three'],
  ])
  const [selected, setSelected] = React.useState<Choice>('one')

  return (
    <>
      <Banner onDismiss={action('onDismiss')}>
        <Banner.Content>
          <Banner.Title>Info</Banner.Title>
          <Banner.Description>
            <Status>{messages.get(selected)}</Status>
          </Banner.Description>
        </Banner.Content>
        <Banner.Actions
          primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
        />
      </Banner>
      <RadioGroup
        sx={{marginTop: 4}}
        name="options"
        onChange={selected => {
          setSelected(selected as Choice)
        }}
      >
        <RadioGroup.Label>Choices</RadioGroup.Label>
        <FormControl>
          <Radio value="one" defaultChecked />
          <FormControl.Label>Choice one</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="two" />
          <FormControl.Label>Choice two</FormControl.Label>
        </FormControl>
        <FormControl>
          <Radio value="three" />
          <FormControl.Label>Choice three</FormControl.Label>
        </FormControl>
      </RadioGroup>
    </>
  )
}

export const WithCustomHeading = () => {
  return (
    <Banner onDismiss={action('onDismiss')}>
      <Banner.Content>
        <Banner.Title as="h3">Info</Banner.Title>
        <Banner.Description>
          GitHub users are{' '}
          <Link inline underline href="#">
            now required
          </Link>{' '}
          to enable two-factor authentication as an additional security measure.
        </Banner.Description>
      </Banner.Content>
      <Banner.Actions
        primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
      />
    </Banner>
  )
}
