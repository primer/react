import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState} from 'react'
import {Button} from '../Button'
import {AriaStatus} from '../LiveRegion'
import {VisuallyHidden} from '../VisuallyHidden'
import {Spinner} from './Spinner'

const meta = {
  title: 'React Tailwind/Display/Spinner/Examples',
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const FullLifecycle: Story = {
  render: function FullLifecycleStory() {
    const [isLoading, setIsLoading] = useState(false)
    const [loadedContent, setLoadedContent] = useState('')
    const state = isLoading ? 'loading' : loadedContent ? 'done' : 'initial'

    async function loadContent() {
      if (state === 'done') return
      setIsLoading(true)
      await wait(1000)
      setLoadedContent('Some content that had to be loaded.')
      setIsLoading(false)
    }

    return (
      <>
        <Button onClick={loadContent} className={state === 'initial' ? undefined : 'mb-4'}>
          Load content
        </Button>
        {state === 'loading' && <Spinner />}
        {loadedContent ? <p>{loadedContent}</p> : null}
        <VisuallyHidden>
          <AriaStatus>{state === 'done' ? 'Content finished loading' : ''}</AriaStatus>
        </VisuallyHidden>
      </>
    )
  },
}

export const FullLifecycleVisibleLoadingText: Story = {
  render: function FullLifecycleVisibleLoadingTextStory() {
    const [isLoading, setIsLoading] = useState(false)
    const [loadedContent, setLoadedContent] = useState('')
    const state = isLoading ? 'loading' : loadedContent ? 'done' : 'initial'

    async function loadContent() {
      if (state === 'done') return
      setIsLoading(true)
      await wait(1000)
      setLoadedContent('Some content that had to be loaded.')
      setIsLoading(false)
    }

    return (
      <div className="flex flex-col items-start gap-2">
        <Button onClick={loadContent} className="mb-4">
          Load content
        </Button>
        {state !== 'done' && (
          <div className="flex items-center gap-1">
            {state === 'loading' && <Spinner size="small" srText={null} />}
            <AriaStatus>{state === 'loading' ? 'Content is loading...' : ''}</AriaStatus>
          </div>
        )}
        <p>{loadedContent}</p>
        <VisuallyHidden>
          <AriaStatus>{state === 'done' ? 'Content finished loading' : ''}</AriaStatus>
        </VisuallyHidden>
      </div>
    )
  },
}

export const SynchronizedSpinners: Story = {
  render: () => (
    <>
      <Spinner />
      <Spinner delay={250} />
      <Spinner delay={750} />
      <Spinner delay={1500} />
      <Spinner delay={2350} />
    </>
  ),
}
