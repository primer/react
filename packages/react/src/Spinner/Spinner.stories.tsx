import type {Meta, StoryFn} from '@storybook/react-vite'
import Spinner from './Spinner'
import {useEffect, useState} from 'react'

export default {
  title: 'Components/Spinner',
  component: Spinner,
} as Meta<typeof Spinner>

export const Default = () => {
  return (
    <>
      <div>
        <Spinner />
      </div>
      <div>
        <Spinner />
      </div>
      <Delay ms={1500}>
        <div>
          <Spinner />
        </div>
      </Delay>
      <Delay ms={2500}>
        <div>
          <Spinner />
        </div>
        <div>
          <Spinner />
        </div>
      </Delay>
    </>
  )
}

function Delay({children, ms}: {children: React.ReactNode; ms: number}) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), ms)
    return () => clearTimeout(timeout)
  }, [ms])
  return show ? <>{children}</> : null
}

export const Playground: StoryFn<typeof Spinner> = args => <Spinner {...args} />

Playground.args = {
  size: 'medium',
}

Playground.argTypes = {
  size: {
    control: {
      type: 'radio',
    },
    options: ['small', 'medium', 'large'],
  },
}
