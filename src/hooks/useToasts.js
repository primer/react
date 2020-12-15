import {useContext} from 'react'
import {ToastContext} from '../ToastContainer'

export default function useToasts() {
  const toastContext = useContext(ToastContext)
  if (!toastContext) {
    // eslint-disable-next-line no-console
    console.error('useToasts can only be used in children of a ToastContainer')
    return {addToast: () => null}
  }
  return {addToast: toastContext.addToast}
}
