import React from 'react'
import PropTypes from 'prop-types'
import Toast from './Toast'
import Box from './Box'
import theme from './theme'

const ToastContainer = (props) => {
  const {toasts, removeToast, startRemovingToast, cancelAutoDismiss, ...rest} = props
  const toastProps = {removeToast, startRemovingToast, cancelAutoDismiss}
  return (
    <Box {...rest}>
      {toasts &&
        toasts.map((toast) => {
          return <Toast key={toast.id} className={toast.className} toast={toast} {...toastProps} />
        })}
    </Box>
  )
}

ToastContainer.defaultProps = {
  theme,
}

ToastContainer.propTypes = {
  ...Box.propTypes,
  cancelAutoDismiss: PropTypes.func,
  removeToast: PropTypes.func,
  startRemovingToast: PropTypes.func,
  toasts: PropTypes.object,
}
export default ToastContainer
