import {useState} from 'react'

function useListbox({onChange}: {onChange?: ({value}: {value: string | null}) => void} = {}) {
  const [active, setActive] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  function selectOption(value: string) {
    setSelected(value)
    if (onChange) {
      onChange({value})
    }
  }

  function unselectOption() {
    setSelected(null)
    if (onChange) {
      onChange({value: null})
    }
  }

  function getListboxProps() {
    return {
      role: 'listbox',
      onKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          const options = Array.from(event.currentTarget.querySelectorAll('[role="option"]')) as Array<HTMLElement>
          const activeIndex = options.findIndex(option => option.getAttribute('data-active') === 'true')
          const nextIndex = (activeIndex + 1) % options.length
          options[nextIndex].focus()
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          const options = Array.from(event.currentTarget.querySelectorAll('[role="option"]')) as Array<HTMLElement>
          const activeIndex = options.findIndex(option => option.getAttribute('data-active') === 'true')
          const nextIndex = (activeIndex - 1 + options.length) % options.length
          options[nextIndex].focus()
        } else if (event.key === 'Home') {
          event.preventDefault()
          const option = event.currentTarget.querySelector('[role="option"]')
          if (option instanceof HTMLElement) {
            option.focus()
          }
        } else if (event.key === 'End') {
          event.preventDefault()
          const options = Array.from(event.currentTarget.querySelectorAll('[role="option"]')) as Array<HTMLElement>
          const option = options[options.length - 1]
          if (option instanceof HTMLElement) {
            option.focus()
          }
        }
      },
    }
  }

  function getOptionProps({value}: {value: string}) {
    return {
      'aria-selected': selected === value,
      'aria-disabled': false,
      'data-active': active === value,
      role: 'option',
      tabIndex: active === value,
      onClick() {
        if (selected === value) {
          unselectOption()
        } else {
          selectOption(value)
        }
      },
      onKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (selected === value) {
            unselectOption()
          } else {
            selectOption(value)
          }
        }
      },
      onFocus() {
        setActive(value)
      },
    }
  }

  return {
    getListboxProps,
    getOptionProps,
  }
}

export {useListbox}
