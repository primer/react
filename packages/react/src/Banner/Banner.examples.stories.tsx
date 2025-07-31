import {Banner} from '../Banner'
import {action} from 'storybook/actions'
import Link from '../Link'
import type {Meta} from '@storybook/react-vite'
import {AriaAlert, AriaStatus} from '../live-region'
import FormControl from '../FormControl'
import RadioGroup from '../RadioGroup'
import Radio from '../Radio'
import {Button} from '../Button'
import React from 'react'
import {useFocus} from '../internal/hooks/useFocus'
import {PageLayout} from '../PageLayout'

const meta = {
  title: 'Experimental/Components/Banner/Examples',
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
        <Banner
          ref={bannerRef}
          title="Error"
          description={<AriaAlert>Something went wrong. Please try again later.</AriaAlert>}
          variant="critical"
        />
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

export const WithAnnouncement = () => {
  type Choice = 'one' | 'two' | 'three'
  const messages: Map<Choice, string> = new Map([
    ['one', 'This is a message for choice one'],
    ['two', 'This is a message for choice two'],
    ['three', 'This is a message for choice three'],
  ])
  const [selected, setSelected] = React.useState<Choice>('one')

  return (
    <>
      <Banner
        title="Info"
        description={<AriaStatus>{messages.get(selected)}</AriaStatus>}
        onDismiss={action('onDismiss')}
        primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
      />
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
    <Banner
      onDismiss={action('onDismiss')}
      primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
      secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
    >
      <Banner.Title as="h3">Info</Banner.Title>
      <Banner.Description>
        GitHub users are{' '}
        <Link inline href="#">
          now required
        </Link>{' '}
        to enable two-factor authentication as an additional security measure.
      </Banner.Description>
    </Banner>
  )
}

export const InSidebar = () => {
  return (
    <>
      <PageLayout>
        <PageLayout.Header divider="line">PageLayout Header</PageLayout.Header>
        <PageLayout.Pane position="start" divider="line">
          <h2>PageLayout Pane</h2>
          <Banner
            title="Info"
            description={
              <>
                GitHub users are{' '}
                <Link inline href="#">
                  now required
                </Link>{' '}
                to enable two-factor authentication as an additional security measure.
              </>
            }
            primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
            secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
          />
        </PageLayout.Pane>
        <PageLayout.Content>
          <h1>PageLayout Content</h1>
        </PageLayout.Content>
      </PageLayout>
    </>
  )
}

export const Multiline = () => {
  return (
    <Banner
      onDismiss={action('onDismiss')}
      title="Info"
      description="GitHub users are now required to enable two-factor authentication as an additional security measure. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
      primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
      secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
    />
  )
}

export const DismissBanner = () => {
  const ref = React.useRef<React.ElementRef<'h2'>>(null)
  const [banner, setBanner] = React.useState<React.ComponentPropsWithoutRef<typeof Banner> | null>({
    title: 'Info',
    description: (
      <>
        GitHub users are{' '}
        <Link inline href="#">
          now required
        </Link>{' '}
        to enable two-factor authentication as an additional security measure.
      </>
    ),
  })

  return (
    <>
      <main>
        {banner ? (
          <Banner
            title={banner.title}
            description={banner.description}
            onDismiss={() => {
              setBanner(null)
              ref.current?.focus()
            }}
          />
        ) : null}
        <h2 ref={ref} tabIndex={-1}>
          Example page title
        </h2>
        <p>Example page content</p>
      </main>
    </>
  )
}
