import React, {useState, useEffect, useCallback, useRef, createContext} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import sx from './sx'

export const DetailsContext = createContext()

const StyledDetails = styled.details`
  & > summary {
    list-style: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }

  ${COMMON}
  ${sx};
`

export const Details = React.forwardRef(({overlay, onClickOutside, defaultOpen = false, ...rest}, forwardedRef) => {
  const [open, setOpen] = useState(defaultOpen)
  const backupRef = useRef(null)
  const ref = forwardedRef ?? backupRef

  const contextProviderValues = {
    open,
    setOpen
  }

  const onClickOutsideInternal = useCallback(
    event => {
      if (event.target.closest('details') !== ref.current) {
        onClickOutside && onClickOutside(event)
        if (!event.defaultPrevented) {
          setOpen(false)
        }
      }
    },
    [ref, onClickOutside, setOpen]
  )

  // handles the overlay behavior - closing the menu when clicking outside of it
  useEffect(() => {
    if (open && overlay) {
      document.addEventListener('click', onClickOutsideInternal)
      return () => {
        document.removeEventListener('click', onClickOutsideInternal)
      }
    }
  }, [open, overlay, onClickOutsideInternal])

  const handleToggle = e => {
    if (!e.defaultPrevented) {
      setOpen(e.target.open)
    }
  }

  return (
    <DetailsContext.Provider value={contextProviderValues}>
      <StyledDetails {...rest} ref={ref} open={open} onToggle={handleToggle} />
    </DetailsContext.Provider>
  )
})

Details.defaultProps = {
  theme,
  overlay: false
}

Details.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  defaultOpen: PropTypes.bool,
  overlay: PropTypes.bool,
  render: PropTypes.func,
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...sx.propTypes
}
