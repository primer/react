import React, {createContext} from 'react'
import PropTypes from 'prop-types'
import Toast from './Toast'
import Box from './Box'
import theme from './theme'
import useToasts from './hooks/useToasts'

const ToastContext = createContext()

const ToastContainer = (props) => {
  const {autoDismiss, timeout, ...rest} = props
  const {addToast, getToastProps} = useToasts({autoDismiss, timeout})
  const {toasts, ...toastProps} = getToastProps()

  return (
    <ToastContext.Provider value={addToast}>
      <Box {...rest}>
        {toasts &&
          toasts.map((toast) => {
            return <Toast key={toast.id} className={toast.className} toast={toast} {...toastProps} />
          })}
      </Box>
    </ToastContext.Provider>
  )
}

ToastContainer.Context = {
  addToast: PropTypes.func,
}

ToastContainer.defaultProps = {
  theme,
}

ToastContainer.propTypes = {
  ...Box.propTypes,
  autoDismiss: PropTypes.bool,
  timeout: PropTypes.number,
}
export default ToastContainer
