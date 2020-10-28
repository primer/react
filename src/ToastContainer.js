import React from 'react'
import Toast from './Toast'

const ToastContainer = ({toasts, removeToast}) => {
  return (
    <>
      {toasts && toasts.map((toast) => {
        return <Toast key={toast.id} onCloseClick={() => removeToast(toast.id)} type={toast.type}>{toast.message}</Toast>
      })}
    </>
  )
}

export default ToastContainer