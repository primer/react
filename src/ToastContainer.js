import PropTypes from 'prop-types'
import React, {createContext} from 'react'
import Toast from './Toast'
import useToastsInternal from './useToastsInternal'

export const ToastContext = createContext()

const ToastContainer = (props) => {
  const {autoDismiss, timeout, children} = props
  const {addToast, getToastProps} = useToastsInternal({autoDismiss, timeout})
  const {toasts, ...toastProps} = getToastProps()

  return (
    <ToastContext.Provider value={{addToast}}>
      {children}
      {toasts &&
        toasts.map((toast) => {
          return <Toast key={toast.id} className={toast.className} toast={toast} {...toastProps} />
        })}
    </ToastContext.Provider>
  )
}

ToastContainer.propTypes = {
  autoDismiss: PropTypes.bool,
  timeout: PropTypes.number,
}

export default ToastContainer
