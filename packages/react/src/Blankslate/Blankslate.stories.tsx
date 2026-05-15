import {BookIcon} from '@primer/octicons-react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import {Blankslate} from '../Blankslate'
import type {ComponentProps} from '../utils/types'

export default {
  title: 'Experimental/Components/Blankslate',
  component: Blankslate,
  subcomponents: {
    'Blankslate.Visual': Blankslate.Visual,
    'Blankslate.Heading': Blankslate.Heading,
    'Blankslate.Description': Blankslate.Description,
    'Blankslate.Action': Blankslate.Action,
    'Blankslate.PrimaryAction': Blankslate.PrimaryAction,
    'Blankslate.SecondaryAction': Blankslate.SecondaryAction,
  },
} as Meta<typeof Blankslate>

export const Default = () => (
  <Blankslate>
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Welcome to the mona wiki!</Blankslate.Heading>
    <Blankslate.Description>
      Wikis provide a place in your repository to lay out the roadmap of your project, show the current status, and
      document software better, together.
    </Blankslate.Description>
    <Blankslate.Action href="#">Create the first page</Blankslate.Action>
    <Blankslate.Action href="#" variant="secondary">
      Learn more about wikis
    </Blankslate.Action>
  </Blankslate>
)

export const Playground: StoryFn<
  ComponentProps<typeof Blankslate> & {primaryAction: boolean; secondaryAction: boolean}
> = ({primaryAction, secondaryAction, ...rest}) => (
  <Blankslate {...rest}>
    <Blankslate.Visual>
      <BookIcon size="medium" />
    </Blankslate.Visual>
    <Blankslate.Heading>Welcome to the mona wiki!</Blankslate.Heading>
    <Blankslate.Description>
      Wikis provide a place in your repository to lay out the roadmap of your project, show the current status, and
      document software better, together.
    </Blankslate.Description>
    {primaryAction ? <Blankslate.Action href="#">Create the first page</Blankslate.Action> : null}
    {secondaryAction ? (
      <Blankslate.Action href="#" variant="secondary">
        Learn more about wikis
      </Blankslate.Action>
    ) : null}
  </Blankslate>
)

Playground.args = {
  border: false,
  narrow: false,
  spacious: false,
  size: 'medium',
  primaryAction: true,
  secondaryAction: true,
}

Playground.argTypes = {
  size: {
    controls: {
      options: ['small', 'medium', 'large'],
    },
  },
}
