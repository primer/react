import React from 'react'
import Toast from './Toast'

const ToastContainer = ({toasts, removeToast, cancelAutoDismiss}) => {
  return (
    <>
      {toasts &&
        toasts.map(toast => {
          return (
            <Toast
              key={toast.id}
              id={toast.id}
              toast={toast}
              removeToast={() => removeToast(toast.id)}
              cancelAutoDismiss={cancelAutoDismiss}
            />
          )
        })}
    </>
  )
}

export default ToastContainer
