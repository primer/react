import {useContext} from 'react'
import {ToastContext} from '../ToastContainer'

export default function useToasts() {
  const {addToast} = useContext(ToastContext)
  // eslint-disable-next-line no-console
  if (!addToast) console.error('You can only use addToast when wrapped inside ToastContainer')
  return {addToast}
}
