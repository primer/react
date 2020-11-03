import {animated, useTransition} from 'react-spring'

import React from 'react'
import Toast from './Toast'

const ToastContainer = ({toasts, removeToast}) => {
  const animatedToasts = useTransition(toasts, toast => toast.id, {
    from: { transform: 'translateX(-400px)' },
    enter: { transform: 'translateX(0)' },
    leave: { transform: 'translateX(-460px)' }
  })
  return (
    <>
      {animatedToasts && animatedToasts.map(({item: toast, props, key}) => {
        return (
          <animated.div key={key} style={props} >
            <Toast key={toast.id} id={toast.id} removeToast={() => removeToast(toast.id)} type={toast.type}>{toast.message}</Toast>
          </animated.div>
        )
      })}
    </>
  )
}

export default ToastContainer