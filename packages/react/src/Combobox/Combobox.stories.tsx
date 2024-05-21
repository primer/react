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

type Group = {
  label: string
  options: Array<Option>
}

type Option = {
  id: string
  value: string
}

const data: Array<Group> = [
  {
    label: 'Recent',
    options: [
      {
        id: 'recent:1',
        value: 'Recent project 1',
      },
      {
        id: 'recent:2',
        value: 'Recent project 2',
      },
      {
        id: 'recent:3',
        value: 'Recent project 3',
      },
    ],
  },
  {
    label: 'Repository',
    options: [
      {
        id: 'repo:1',
        value: 'Repo project 1',
      },
      {
        id: 'repo:2',
        value: 'Repo project 2',
      },
      {
        id: 'repo:3',
        value: 'Repo project 3',
      },
    ],
  },
  {
    label: 'Organization',
    options: [
      {
        id: 'org:1',
        value: 'Org project 1',
      },
      {
        id: 'org:2',
        value: 'Org project 2',
      },
      {
        id: 'org:3',
        value: 'Org project 3',
      },
    ],
  },
] as const

export const Groups = () => {
  const comboboxRef = React.useRef<React.ElementRef<'input'>>(null)
  const listboxRef = React.useRef<React.ElementRef<'div'>>(null)
  const labelId = React.useId()
  const comboboxId = React.useId()
  const listboxId = React.useId()
  const selectedId = React.useId()
  const [groups, setGroups] = React.useState(data)
  const [activeOptionId, setActiveOptionId] = React.useState<string>(() => {
    if (data.length > 0) {
      const group = data[0]
      if (group.options.length > 0) {
        return group.options[0].id
      }
    }
    return ''
  })
  const [popupVisible, setPopupVisible] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [selected, setSelected] = React.useState<Array<string>>([])

  function setNextOptionActive() {
    const options = groups.flatMap(group => {
      return group.options.map(option => {
        return {
          ...option,
          group: group.label,
        }
      })
    })
    const activeOptionIndex = options.findIndex(option => {
      return option.id === activeOptionId
    })
    const activeOption = options[activeOptionIndex]
    const nextActiveOptionIndex = Math.min(options.length - 1, activeOptionIndex + 1)
    const nextActiveOption = options[nextActiveOptionIndex]
    setActiveOptionId(nextActiveOption.id)

    const item = selected.includes(nextActiveOption.id) ? `${nextActiveOption.value} selected` : nextActiveOption.value

    // Changing groups
    if (activeOption.group !== nextActiveOption.group) {
      const group = groups.find(group => {
        return group.label === nextActiveOption.group
      })
      if (group) {
        announce(`${group.label} group entered, with ${group.options.length} options. ${item}`, {
          politeness: 'assertive',
        })
      }
    } else {
      announce(item, {
        politeness: 'assertive',
      })
    }
  }

  function setPreviousOptionActive() {
    const options = groups.flatMap(group => {
      return group.options.map(option => {
        return {
          ...option,
          group: group.label,
        }
      })
    })
    const activeOptionIndex = options.findIndex(option => {
      return option.id === activeOptionId
    })
    const activeOption = options[activeOptionIndex]
    const nextActiveOptionIndex = Math.max(0, activeOptionIndex - 1)
    const nextActiveOption = options[nextActiveOptionIndex]
    setActiveOptionId(nextActiveOption.id)

    const item = selected.includes(nextActiveOption.id) ? `${nextActiveOption.value} selected` : nextActiveOption.value

    // Changing groups
    if (activeOption.group !== nextActiveOption.group) {
      const group = groups.find(group => {
        return group.label === nextActiveOption.group
      })
      if (group) {
        announce(`${group.label} group entered, with ${group.options.length} options. ${item}`, {
          politeness: 'assertive',
        })
      }
    } else {
      announce(item, {
        politeness: 'assertive',
      })
    }
  }

  function toggleOptionSelection(optionId: string) {
    if (selected.includes(optionId)) {
      setSelected(
        selected.filter(id => {
          return id !== optionId
        }),
      )
    } else {
      setSelected([...selected, optionId])
    }
  }

  const closePopup = useEventCallback(() => {
    setPopupVisible(false)
  })

  React.useEffect(() => {
    function handler(event: MouseEvent) {
      if (comboboxRef.current?.contains(event.target as HTMLElement)) {
        return
      } else if (listboxRef.current?.contains(event.target as HTMLElement)) {
        return
      }
      closePopup()
    }

    document.addEventListener('click', handler)
    return () => {
      document.removeEventListener('click', handler)
    }
  }, [closePopup])

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <ul id={selectedId}>
        {selected.map(id => {
          const [option] = data.flatMap(group => {
            const option = group.options.find(option => {
              return option.id === id
            })
            if (option) {
              return option
            }
            return []
          })

          return <li key={id}>{option.value}</li>
        })}
      </ul>
      <label htmlFor="group-combobox" id={labelId}>
        Projects
      </label>
      <input
        ref={comboboxRef}
        aria-activedescendant={activeOptionId}
        aria-controls={listboxId}
        aria-expanded={popupVisible}
        aria-labelledby={`${labelId} ${selectedId}`}
        aria-multiselectable={true}
        id={comboboxId}
        value={value}
        onChange={event => {
          setValue(event.target.value)
          if (event.target.value === '') {
            setGroups(data)
          } else {
            setPopupVisible(true)

            const value = event.target.value.toLowerCase()
            const nextGroups = data.flatMap(group => {
              const options = group.options.filter(option => {
                return option.value.toLowerCase().includes(value)
              })
              if (options.length === 0) {
                return []
              }
              return {
                ...group,
                options,
              }
            })

            const group = nextGroups.find(group => {
              return group.options.find(option => {
                return option.id === activeOptionId
              })
            })
            setGroups(nextGroups)

            if (nextGroups.length === 0) {
              announce(`No options available`, {
                politeness: 'assertive',
              })
            } else if (group) {
              const count = nextGroups.reduce((sum, group) => {
                return sum + group.options.length
              }, 0)
              announce(`${count} options available`, {
                politeness: 'assertive',
              })
            } else {
              const count = nextGroups.reduce((sum, group) => {
                return sum + group.options.length
              }, 0)
              const option = nextGroups[0].options[0]
              if (option) {
                setActiveOptionId(option.id)
                announce(`${count} options available. ${option.value}`, {
                  politeness: 'assertive',
                })
              } else {
                announce(`${count} options available`, {
                  politeness: 'assertive',
                })
              }
            }
          }
        }}
        onClick={() => {
          if (!popupVisible) {
            setPopupVisible(true)
            const option = groups
              .flatMap(group => {
                return group.options
              })
              .find(option => {
                return option.id === activeOptionId
              })
            if (option) {
              const announcement = selected.includes(option.id) ? `${option.value} selected` : option.value
              announce(announcement, {
                politeness: 'assertive',
              })
            }
          }
        }}
        onKeyDown={event => {
          if (!popupVisible) {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setPopupVisible(true)

              const option = groups
                .flatMap(group => {
                  return group.options
                })
                .find(option => {
                  return option.id === activeOptionId
                })
              if (option) {
                const announcement = selected.includes(option.id) ? `${option.value} selected` : option.value
                announce(announcement)
              }
            }
            return
          }
          if (event.key === 'ArrowDown') {
            setNextOptionActive()
          } else if (event.key === 'ArrowUp') {
            setPreviousOptionActive()
          } else if (event.key === 'Enter') {
            toggleOptionSelection(activeOptionId)
          } else if (event.key === 'Escape') {
            setPopupVisible(false)
          }
        }}
        role="combobox"
        type="text"
      />
      <div
        ref={listboxRef}
        role="listbox"
        tabIndex={-1}
        hidden={!popupVisible}
        style={{
          border: '1px solid black',
        }}
      >
        {groups.map((group, index) => {
          const groupLabelId = `${listboxId}-group-${index}-label`
          return (
            <div key={group.label} role="group" aria-labelledby={groupLabelId}>
              <div
                id={groupLabelId}
                style={{
                  padding: '0.25rem 1rem',
                  background: 'rgba(0, 0, 0, 0.05)',
                }}
              >
                {group.label}
              </div>
              {group.options.map(option => {
                const active = activeOptionId === option.id
                return (
                  <div
                    key={option.id}
                    aria-disabled={false}
                    aria-selected={selected.includes(option.id)}
                    data-active={active}
                    id={option.id}
                    onClick={() => {
                      toggleOptionSelection(option.id)
                    }}
                    role="option"
                    style={{
                      background: active ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                      cursor: 'pointer',
                      padding: '0.25rem 1rem',
                    }}
                  >
                    {selected.includes(option.id) ? '✅ ' : ''}
                    {option.value}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function useEventCallback<T extends (...args: Array<any>) => void>(callback: T) {
  const savedCallback = React.useRef(callback)

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  return React.useCallback((...args: Parameters<T>) => {
    savedCallback.current?.(...args)
  }, [])
}
