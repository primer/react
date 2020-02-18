import {useContext} from 'react'
import {MenuContext} from '../SelectMenuContext'

function useMenuFilter() {
  const {filterText, setFilterText} = useContext(MenuContext)

  const onChange = ev => {
    setFilterText(ev.target.value)
  }

  return [filterText, onChange]
}

export default useMenuFilter
