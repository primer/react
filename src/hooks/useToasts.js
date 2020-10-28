import {useState} from 'react'
import uuid from 'uuid'

export const useToasts = () => {
    const [toasts, setToasts] = useState([])

    const addToast = (freshToast) => {
      setToasts([{id: uuid(), ...freshToast}, ...toasts])
    }

    const removeToast = (id) => {
      setToasts(oldToasts => {
        oldToasts.filter(toast => {
          return toast.id !== id
        })
      })
    }

    return {toasts, addToast, removeToast}
}