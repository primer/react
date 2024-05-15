import React from 'react'
import {announce} from '@primer/live-region-element'

const meta = {
  title: 'Private/Components/Combobox',
}

export default meta

function useCombobox({
  items,
  multiselectable = false,
}: {
  items: ReadonlyArray<{id: string | number; item: string}>
  multiselectable?: boolean
}) {
  const [options, setOptions] = React.useState<ReadonlyArray<{id: string; item: string}>>(items)
  const [activeDescendant, setActiveDescendant] = React.useState(() => {
    if (options.length > 0) {
      return options[0].id
    }
    return ''
  })
  const [isPopupVisible, setPopupVisible] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [selected, setSelected] = React.useState<ReadonlyArray<{id: string; item: string}>>([])

  const combobox = {
    activeDescendant,
    isPopupVisible,
    selected,
    options,
    value,
    multiselectable,
    onValueChange: ({value}: {value: string}) => {
      setValue(value)
    },
    setActiveOption(id: string) {
      const option = options.find(option => {
        return option.id === id
      })
      if (option) {
        setActiveDescendant(id)
        announce(option.item, {
          politeness: 'assertive',
        })
      }
    },
    setNextOptionActive() {
      const activeOptionIndex = options.findIndex(option => {
        return option.id === activeDescendant
      })
      if (activeOptionIndex !== -1) {
        const nextOption = options[Math.min(options.length - 1, activeOptionIndex + 1)]
        combobox.setActiveOption(nextOption.id)
      }
    },
    setPreviousOptionActive() {
      const activeOptionIndex = options.findIndex(option => {
        return option.id === activeDescendant
      })
      if (activeOptionIndex !== -1) {
        const nextOption = options[Math.max(0, activeOptionIndex - 1)]
        combobox.setActiveOption(nextOption.id)
      }
    },
    setFirstOptionActive() {
      if (options.length > 0) {
        combobox.setActiveOption(options[0].id)
      }
    },
    setLastOptionActive() {
      if (options.length > 0) {
        combobox.setActiveOption(options[options.length - 1].id)
      }
    },
    clearSelection() {
      setSelected([])
    },
    toggleActiveOptionSelection() {
      const activeOption = options.find(option => {
        return option.id === activeDescendant
      })
      if (!activeOption) {
        return
      }

      const selectedIndex = selected.findIndex(option => {
        return option.id === activeOption.id
      })
      if (selectedIndex === -1) {
        setSelected([...selected, activeOption])
      } else {
        setSelected([...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)])
      }
    },
    toggleOptionSelection(id: string) {
      const option = options.find(option => {
        return option.id === id
      })
      if (!option) {
        return
      }

      const selectedIndex = selected.findIndex(selectedOption => {
        return selectedOption.id === option.id
      })
      if (selectedIndex === -1) {
        setSelected([...selected, option])
      } else {
        setSelected([...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)])
      }
    },
    deselectOption(id: string) {
      const selectedIndex = selected.findIndex(selectedOption => {
        return selectedOption.id === id
      })
      if (selectedIndex !== -1) {
        setSelected([...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)])
      }
    },
    openPopup() {
      setPopupVisible(true)
    },
    closePopup() {
      setPopupVisible(false)
    },
  }

  return combobox
}

export const Default = () => {
  const items = [
    {
      id: '0',
      item: 'Item 1',
    },
    {
      id: '1',
      item: 'Item 2',
    },
    {
      id: '2',
      item: 'Item 3',
    },
    {
      id: '3',
      item: 'Item 4',
    },
    {
      id: '4',
      item: 'Item 5',
    },
  ] as const
  const combobox = useCombobox({items})
  const labelId = React.useId()
  const comboboxId = React.useId()
  const listboxId = React.useId()
  const selectedListId = React.useId()
  const containerRef = React.useRef<React.ElementRef<'div'>>(null)
  const comboboxRef = React.useRef<React.ElementRef<'input'>>(null)
  const closePopup = useEventCallback((target: Node) => {
    if (!combobox.isPopupVisible) {
      return
    }

    if (!containerRef.current?.contains(target as Node)) {
      combobox.closePopup()
    }
  })

  React.useEffect(() => {
    function listener(event: MouseEvent) {
      if (!event.target) {
        return
      }

      closePopup(event.target as Node)
    }

    window.addEventListener('click', listener)
    return () => {
      window.removeEventListener('click', listener)
    }
  }, [closePopup])

  return (
    <>
      {combobox.selected.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            combobox.clearSelection()
            comboboxRef.current?.focus()
          }}
        >
          Clear
        </button>
      ) : null}
      <ul id={selectedListId}>
        {combobox.selected.map(option => {
          return (
            <li key={option.id}>
              <button
                onClick={() => {
                  combobox.deselectOption(option.id)
                  // todo: focus previous option, if one exists
                }}
                type="button"
              >
                {option.item}
              </button>
            </li>
          )
        })}
      </ul>
      <div ref={containerRef}>
        <label id={labelId} htmlFor="combobox">
          Pick a label
        </label>
        <input
          ref={comboboxRef}
          aria-activedescendant={combobox.activeDescendant}
          aria-controls={listboxId}
          aria-expanded={combobox.isPopupVisible}
          aria-labelledby={`${labelId} ${selectedListId}`}
          id={comboboxId}
          value={combobox.value}
          onChange={event => {
            combobox.onValueChange({value: event.target.value})
          }}
          onClick={() => {
            if (!combobox.isPopupVisible) {
              combobox.openPopup()
            }
          }}
          onKeyDown={event => {
            if (!combobox.isPopupVisible) {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                combobox.openPopup()
              }
              return
            }

            if (event.key === 'ArrowDown') {
              combobox.setNextOptionActive()
            } else if (event.key === 'ArrowUp') {
              combobox.setPreviousOptionActive()
            } else if (event.key === 'Enter') {
              combobox.toggleActiveOptionSelection()
            } else if (event.key === 'Escape') {
              combobox.closePopup()
            } else if (event.key === 'Home') {
              combobox.setFirstOptionActive()
            } else if (event.key === 'End') {
              combobox.setLastOptionActive()
            }
          }}
          role="combobox"
          type="text"
        />
        {combobox.isPopupVisible ? (
          <button
            aria-hidden="true"
            tabIndex={-1}
            type="button"
            onClick={() => {
              combobox.closePopup()
            }}
          >
            X
          </button>
        ) : null}
        <div
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          hidden={!combobox.isPopupVisible}
          aria-multiselectable={combobox.multiselectable}
        >
          {combobox.options.map(option => {
            const active = combobox.activeDescendant === option.id
            const selected = combobox.selected.some(selectedOption => {
              return selectedOption.id === option.id
            })
            return (
              <div
                key={option.id}
                aria-disabled={false}
                aria-selected={selected}
                data-active={active}
                id={option.id}
                tabIndex={-1}
                onClick={() => {
                  combobox.setActiveOption(option.id)
                  combobox.toggleOptionSelection(option.id)
                  comboboxRef.current?.focus()
                }}
                style={{
                  background: active ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                {selected ? '✅' : null}
                {option.item}
              </div>
            )
          })}
        </div>
      </div>
      <live-region />
    </>
  )
}

function useEventCallback<T extends (...args: Array<any>) => void>(callback: T) {
  const savedCallback = React.useRef(callback)

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  return React.useCallback<T>((...args) => {
    savedCallback.current?.(...args)
  }, [])
}
