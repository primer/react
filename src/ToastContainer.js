import React from 'react'
import Toast from './Toast'

const ToastContainer = ({toasts, ...rest}) => {
  return (
    <>
      {toasts &&
        toasts.map((toast) => {
          return (
            <Toast
              key={toast.id}
              id={toast.id}
              toast={toast}
              {...rest}
            />
          )
        })}
    </>
  )
}

export default ToastContainer
