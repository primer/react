function useMenu() {
  function getMenuProps() {
    return {
      role: 'menu',
    }
  }

  function getMenuItemProps() {
    return {}
  }

  return {
    getMenuProps,
    getMenuItemProps,
  }
}

export {useMenu}
