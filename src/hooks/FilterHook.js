import {useContext, useEffect, useState} from 'react'
import {MenuContext} from '../SelectMenu'

function useFilter() {
  const {setFilterText} = useContext(MenuContext)
  const [value, setValue] = useState(undefined)
  const onChange = ev => {
    setValue(ev.target.value)
  }
  useEffect(() => {
    setFilterText(value)
  }, [value])
  return [value, onChange]
}

export default useFilter