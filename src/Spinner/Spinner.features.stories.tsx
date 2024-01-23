import React from 'react'
import {ComponentMeta} from '@storybook/react'
import Spinner from './Spinner'
import {Button} from '../Button'
import {useAnnounce} from '../internal/components/LiveRegion'

export default {
  title: 'Components/Spinner/Features',
  component: Spinner,
} as ComponentMeta<typeof Spinner>

export const Small = () => <Spinner size="small" />

export const Large = () => <Spinner size="large" />

export const WithLoadingMessage = () => {
  const [loading, setLoading] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const announce = useAnnounce()
  let timeoutId = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => {
          setLoading(true)
          timeoutId.current = window.setTimeout(() => {
            setLoading(false)
            buttonRef.current?.focus()
            announce('Spinner example complete')
          }, 2500)
        }}
      >
        Start loading
      </Button>
      {loading ? <Spinner loadingMessage="Spinner example loading" /> : null}
    </>
  )
}
