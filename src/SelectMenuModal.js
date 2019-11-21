import React, {createContext, useState} from 'react'
import styled from 'styled-components'
import {COMMON} from './constants'
import {modalStyles} from './SelectMenuStyles'
import theme from './theme'

const ModalWrapper = styled.div`
  ${modalStyles}
  ${COMMON}
`
const MenuContext = createContext()

const SelectMenuModal = ({children, initialTab, ...rest}) => {
  const [selectedTab, setSelectedTab] = useState(initialTab)
  const menuProviderValues = {
    selectedTab,
    setSelectedTab
  }

  return (
    <MenuContext.Provider value={menuProviderValues}>
      <details-menu class="details-menu" role="menu">
        <ModalWrapper {...rest}>{children}</ModalWrapper>
      </details-menu>
    </MenuContext.Provider>
  )
}

SelectMenuModal.defaultProps = {
  theme
}

export {SelectMenuModal, MenuContext}
