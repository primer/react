import React from 'react'
import Toast from './Toast'

const ToastContainer = ({toasts, startRemovingToast, removeToast}) => {
  return (
    <>
      {toasts && toasts.map((toast) => {
        console.log(toasts)
        return <Toast key={toast.id} id={toast.id} startRemovingToast={startRemovingToast} removeToast={removeToast} type={toast.type} show={toast.show}>{toast.message}</Toast>
      })}
    </>
  )
}

export default ToastContainer