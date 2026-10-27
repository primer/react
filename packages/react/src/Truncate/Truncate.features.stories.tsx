import type {Meta} from '@storybook/react-vite'
import Truncate from './Truncate'
import Link from '../Link'
import {ArrowLeftIcon, ArrowRightIcon} from '@primer/octicons-react'

export default {
  title: 'Components/Truncate/Features',
  component: Truncate,
} as Meta<typeof Truncate>

export const Expandable = () => (
  <Truncate title="Hover this example text" expandable>
    Hover this example text
  </Truncate>
)

export const Inline = () => (
  <>
    <ArrowRightIcon />
    <Truncate title="Inline example text" inline>
      Inline example text
    </Truncate>
    <ArrowLeftIcon />
  </>
)

export const MaxWidth = () => (
  <Truncate title="Some example text with a max width" maxWidth={200}>
    Some example text with a max width
  </Truncate>
)

export const AsLink = () => {
  const url = 'https://github.com/primer/react/blob/main/packages/react/src/Truncate/Truncate.tsx'
  return (
    <p>
      Mirror:{' '}
      <Truncate as={Link} href={url} title={url} maxWidth={300} inline>
        {url}
      </Truncate>{' '}
      (inline link inside text)
    </p>
  )
}
