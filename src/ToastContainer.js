import React from 'react'
import Toast from './Toast'

const ToastContainer = ({toasts, removeToast}) => {
  return (
    <>
      {toasts.map((toast) => {
        return <Toast key={toast.id} onCloseClick={removeToast(toast.id)} state={toast.state}>{toast.message}</Toast>
      })}
    </>
  )
}

export default ToastContainer