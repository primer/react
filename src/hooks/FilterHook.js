import {useContext} from 'react'
import {MenuContext} from '../SelectMenuContext'

function useFilter() {
  const {filterText, setFilterText} = useContext(MenuContext)

  const onChange = ev => {
    setFilterText(ev.target.value)
  }

  return [filterText, onChange]
}

export default useFilter
