import React from 'react'
import Toast from './Toast'

const ToastContainer = ({toasts, removeToast}) => {
  return (
    <>
      {toasts &&
        toasts.map(toast => {
          return (
            <Toast key={toast.id} id={toast.id} removeToast={() => removeToast(toast.id)} type={toast.type}>
              {toast.message}
            </Toast>
          )
        })}
    </>
  )
}

export default ToastContainer
