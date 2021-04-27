import {useRef} from 'react'
import {useOnEscapePress} from '..'
import {useCombinedRefs} from '../hooks/useCombinedRefs'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {uniqueId} from '../utils/uniqueId'
import {DefaultBody, DefaultFooter, DefaultHeader, DialogProps} from './Dialog'

export function useDialog(props: DialogProps, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
  const {
    title = 'Dialog',
    subtitle = '',
    renderHeader = DefaultHeader,
    renderBody = DefaultBody,
    renderFooter = DefaultFooter,
    onClose,
    role = 'dialog'
  } = props

  const dialogLabelId = uniqueId()
  const dialogDescriptionId = uniqueId()
  const defaultedProps = {...props, title, subtitle, role, dialogLabelId, dialogDescriptionId}

  const dialogRef = useRef<HTMLDivElement>(null)
  const combinedRef = useCombinedRefs(dialogRef, forwardedRef)
  const backdropRef = useRef<HTMLDivElement>(null)
  useFocusTrap({containerRef: dialogRef, restoreFocusOnCleanUp: true})

  useOnEscapePress(
    (event: KeyboardEvent) => {
      onClose('escape')
      event.preventDefault()
    },
    [onClose]
  )

  const header = renderHeader(defaultedProps)
  const body = renderBody(defaultedProps)
  const footer = renderFooter(defaultedProps)

  return {dialogRef: combinedRef, backdropRef, header, body, footer, defaultedProps}
}
