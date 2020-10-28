import {useEffect, useState} from 'react'

import {nanoid} from 'nanoid'

const useToasts = () => {
    const [toasts, setToasts] = useState([])

    const addToast = (freshToast) => {
      setToasts([{id: nanoid(), ...freshToast}, ...toasts])
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

export default useToasts