import React, {useState, useEffect, useCallback, useRef, createContext} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import sx from './sx'

const DetailsContext = createContext()

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

const Details = React.forwardRef(({overlay, defaultOpen = false, ...rest}, forwardedRef) => {
  const [open, setOpen] = useState(defaultOpen)
  const backupRef = useRef(null)
  const ref = forwardedRef ?? backupRef

  const contextProviderValues = {
    open,
    setOpen
  }

  const onClickOutside = useCallback(
    event => {
      if (event.target.closest('details') !== ref.current) {
        onClickOutside && onClickOutside(event)
        if (!event.defaultPrevented) {
          setOpen(false)
        }
      }
    },
    [ref, setOpen]
  )

  // handles the overlay behavior - closing the menu when clicking outside of it
  useEffect(() => {
    if (open && overlay) {
      document.addEventListener('click', onClickOutside)
      return () => {
        document.removeEventListener('click', onClickOutside)
      }
    }
  }, [open, overlay, onClickOutside])

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

Details.Context = DetailsContext

export default Details
