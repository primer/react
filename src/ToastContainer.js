import React, {createContext} from 'react'
import PropTypes from 'prop-types'
import Toast from './Toast'
import useToastsInternal from './hooks/useToastsInternal'

export const ToastContext = createContext()

const ToastContainer = (props) => {
  const {addToast, getToastProps} = useToastsInternal(props)
  const {toasts, ...toastProps} = getToastProps()

  return (
    <ToastContext.Provider value={addToast}>
      {props.children}
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
