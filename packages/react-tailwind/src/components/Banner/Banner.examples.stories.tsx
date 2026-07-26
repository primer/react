import type {Meta, StoryObj} from '@storybook/react-vite'
import {useRef, useState} from 'react'
import {expect, userEvent, within} from 'storybook/test'
import {Button} from '../Button'
import {FormControl} from '../FormControl'
import {Link} from '../Link'
import {PageLayout} from '../PageLayout'
import {Radio} from '../Radio'
import {RadioGroup} from '../RadioGroup'
import {Banner} from './index'

const description = (
  <>
    GitHub users are{' '}
    <Link inline href="#">
      now required
    </Link>{' '}
    to enable two-factor authentication as an additional security measure.
  </>
)
const meta = {title: 'React Tailwind/Content/Banner/Examples', component: Banner} satisfies Meta<typeof Banner>
export default meta
type Story = StoryObj<typeof meta>

export const WithUserAction: Story = {
  render: function WithUserActionStory() {
    const [hasError, setHasError] = useState(false)
    return (
      <>
        {hasError ? (
          <Banner title="Error" description="Something went wrong. Please try again later." variant="critical" />
        ) : null}
        <Button onClick={() => setHasError(true)}>Update profile</Button>
      </>
    )
  },
}
export const WithAnnouncement: Story = {
  render: function WithAnnouncementStory() {
    const [message, setMessage] = useState('This is a message for choice one')
    return (
      <>
        <Banner
          title="Info"
          description={<span aria-live="polite">{message}</span>}
          onDismiss={() => {}}
          primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
        />
        <RadioGroup
          className="mt-4"
          defaultValue="one"
          name="options"
          onValueChange={choice => setMessage(`This is a message for choice ${choice}`)}
        >
          <span className="text-sm font-semibold">Choices</span>
          {(['one', 'two', 'three'] as const).map(choice => (
            <FormControl key={choice} layout="horizontal">
              <Radio value={choice} />
              <FormControl.Label>Choice {choice}</FormControl.Label>
            </FormControl>
          ))}
        </RadioGroup>
      </>
    )
  },
}
export const WithCustomHeading: Story = {
  render: () => (
    <Banner
      onDismiss={() => {}}
      primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
      secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
    >
      <Banner.Title as="h3">Info</Banner.Title>
      <Banner.Description>{description}</Banner.Description>
    </Banner>
  ),
}
export const InSidebar: Story = {
  render: () => (
    <PageLayout>
      <PageLayout.Header divider="line">PageLayout Header</PageLayout.Header>
      <PageLayout.Pane divider="line" position="start">
        <h2>PageLayout Pane</h2>
        <Banner
          title="Info"
          description={description}
          primaryAction={<Banner.PrimaryAction>Button</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>Button</Banner.SecondaryAction>}
        />
      </PageLayout.Pane>
      <PageLayout.Content>
        <h1>PageLayout Content</h1>
      </PageLayout.Content>
    </PageLayout>
  ),
}
export const Multiline: Story = {
  args: {
    onDismiss: () => {},
    title: 'Info',
    description:
      "GitHub users are now required to enable two-factor authentication as an additional security measure. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    primaryAction: <Banner.PrimaryAction>Button</Banner.PrimaryAction>,
    secondaryAction: <Banner.SecondaryAction>Button</Banner.SecondaryAction>,
  },
}
export const DismissBanner: Story = {
  render: function DismissBannerStory() {
    const [open, setOpen] = useState(true)
    const headingRef = useRef<HTMLHeadingElement>(null)
    return (
      <main>
        {open ? (
          <Banner
            title="Info"
            description={description}
            onDismiss={() => {
              setOpen(false)
              headingRef.current?.focus()
            }}
          />
        ) : null}
        <h2 ref={headingRef} tabIndex={-1}>
          Example page title
        </h2>
        <p>Example page content</p>
      </main>
    )
  },
}

export const DismissalInteraction: Story = {
  render: DismissBanner.render,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', {name: 'Dismiss banner'}))
    await expect(canvas.getByRole('heading', {name: 'Example page title'})).toHaveFocus()
  },
}
