import {useControllableState} from '../hooks/useControllableState'

type UseSelectionOptions<T> = {
  defaultSelected?: Set<T>
  selected?: Set<T>
  onChange?: (selected: Set<T>) => void
}

type Selection<T> = {
  selected: Set<T>
  select: (id: T) => void
  selectMany: (ids: Set<T>) => void
  deselect: (id: T) => void
  deselectMany: (ids: Set<T>) => void
  toggleSelect: (id: T) => void
  clear: () => void
}

function useSelection<T>({
  defaultSelected,
  selected: controlledSelected,
  onChange,
}: UseSelectionOptions<T>): Selection<T> {
  const [selected, setSelected] = useControllableState({
    name: 'useSelection',
    defaultValue: defaultSelected ?? new Set<T>(),
    value: controlledSelected,
    onChange,
  })

  function select(id: T) {
    setSelected(prev => {
      const newSelected = new Set(prev)
      newSelected.add(id)
      return newSelected
    })
  }

  function selectMany(ids: Set<T>) {
    setSelected(prev => {
      return prev.union(ids)
    })
  }

  function deselect(id: T) {
    setSelected(prev => {
      const newSelected = new Set(prev)
      newSelected.delete(id)
      return newSelected
    })
  }

  function deselectMany(ids: Set<T>) {
    setSelected(prev => {
      return prev.difference(ids)
    })
  }

  function toggleSelect(id: T) {
    setSelected(prev => {
      const newSelected = new Set(prev)

      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }

      return newSelected
    })
  }

  function clear() {
    setSelected(new Set())
  }

  return {
    selected,
    select,
    selectMany,
    deselect,
    deselectMany,
    toggleSelect,
    clear,
  }
}

export {useSelection}
