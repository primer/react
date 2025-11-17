import React, {useCallback, useRef, useState, type JSX} from 'react'
import type {Meta} from '@storybook/react-vite'
import {Flash} from '..'
import {Button} from '../Button'
import Link from '../Link'
import {FocusKeys} from '@primer/behaviors'
import type {Direction} from '@primer/behaviors'
import {useFocusZone} from '../hooks/useFocusZone'
import classes from './FocusZoneStories.module.css'

export default {
  title: 'Hooks/useFocusZone',
} as Meta

const MarginButton = ({children, ...props}: React.ComponentProps<typeof Button>) => (
  <Button className={classes.MarginButton} {...props}>
    {children}
  </Button>
)

export const BasicFocusZone = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const [fzEnabled, setFzEnabled] = useState(true)
  const {containerRef} = useFocusZone({disabled: !fzEnabled}, [fzEnabled])

  const toggleFz = useCallback(() => {
    setFzEnabled(!fzEnabled)
  }, [fzEnabled])

  return (<>
    <div className={classes.FlexColumnContainer} onKeyDownCapture={reportKey}>
      <div className={classes.AbsoluteTopRight}>Last key pressed: {lastKey}</div>
      <Button variant={fzEnabled ? 'danger' : 'primary'} onClick={toggleFz} className={classes.MarginBottom3}>
        {fzEnabled ? 'Disable' : 'Enable'} Focus Zone
      </Button>
      <MarginButton>Apple</MarginButton>
      <MarginButton>Banana</MarginButton>
      <MarginButton>Cantaloupe</MarginButton>
      <div className={classes.BorderedContainer} ref={containerRef as React.RefObject<HTMLDivElement | null>}>
        <strong>Use Up Arrow, Down Arrow, Home, and End to move focus within this box.</strong>
        <div className={classes.FlexColumnContainer}>
          <MarginButton>Durian</MarginButton>
          <MarginButton>Elderberry</MarginButton>
          <MarginButton>Fig</MarginButton>
        </div>
      </div>
      <MarginButton>Kiwi</MarginButton>
      <MarginButton>Lemon</MarginButton>
      <MarginButton>Mango</MarginButton>
    </div>
  </>);
}

export const FocusOutBehavior = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const {containerRef: containerRef1} = useFocusZone({
    focusOutBehavior: 'stop',
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
  })
  const {containerRef: containerRef2} = useFocusZone({
    focusOutBehavior: 'wrap',
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
  })

  return (<>
    <div className={classes.FlexColumnContainer} onKeyDownCapture={reportKey}>
      <div className={classes.AbsoluteTopRight}>Last key pressed: {lastKey}</div>
      <MarginButton>Apple</MarginButton>
      <MarginButton>Banana</MarginButton>
      <MarginButton>Cantaloupe</MarginButton>
      <div className={classes.BorderedContainer} ref={containerRef1 as React.RefObject<HTMLDivElement | null>}>
        <strong>
          Use Left Arrow, Right Arrow, Home, and End to move focus within this box. Focus stops at the ends.
        </strong>

        <div className={classes.FlexRowContainer}>
          <MarginButton>Durian</MarginButton>
          <MarginButton>Elderberry</MarginButton>
          <MarginButton>Fig</MarginButton>
        </div>
      </div>
      <div className={classes.BorderedContainer} ref={containerRef2 as React.RefObject<HTMLDivElement | null>}>
        <strong>Use Left Arrow, Right Arrow, Home, and End to move focus within this box. Focus is circular.</strong>

        <div className={classes.FlexRowContainer}>
          <MarginButton>Grapefruit</MarginButton>
          <MarginButton>Honeydew</MarginButton>
          <MarginButton>Jackfruit</MarginButton>
        </div>
      </div>
      <MarginButton>Kiwi</MarginButton>
      <MarginButton>Lemon</MarginButton>
      <MarginButton>Mango</MarginButton>
    </div>
  </>);
}

function getSiblingIndex(element: Element) {
  let child: Element | null = element
  let i = 0
  while ((child = child.previousElementSibling) != null) {
    ++i
  }
  return i
}

export const CustomFocusMovement = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const containerRef = useRef<HTMLElement>(null)

  const getNextFocusable = useCallback(
    (direction: Direction, from: Element | undefined, event: KeyboardEvent): HTMLElement | undefined => {
      const toEnd = direction === 'start' || direction === 'end'
      if (from && containerRef.current) {
        const currentIndex = getSiblingIndex(from)
        let nextIndex = currentIndex
        if (['End', 'ArrowRight'].includes(event.key)) {
          while (nextIndex % 3 !== 2) {
            nextIndex += 1
            if (!toEnd) {
              break
            }
          }
        }
        if (['Home', 'ArrowLeft'].includes(event.key)) {
          while (nextIndex % 3 !== 0) {
            nextIndex -= 1
            if (!toEnd) {
              break
            }
          }
        }
        if (event.key === 'ArrowUp') {
          while (nextIndex - 3 >= 0) {
            nextIndex -= 3
            if (!toEnd) {
              break
            }
          }
        }
        if (event.key === 'ArrowDown') {
          while (nextIndex + 3 < 9) {
            nextIndex += 3
            if (!toEnd) {
              break
            }
          }
        }
        return containerRef.current.children[nextIndex] as HTMLElement
      }
    },
    [containerRef],
  )

  useFocusZone({containerRef, getNextFocusable})

  return (<>
    <div className={classes.FlexColumnContainer} onKeyDownCapture={reportKey}>
      <div className={classes.AbsoluteTopRight}>Last key pressed: {lastKey}</div>
      <MarginButton>Apple</MarginButton>

      <div className={classes.BorderedContainer}>
        <strong>Use arrow keys to move focus within this box.</strong>
        <div className={classes.GridContainer} ref={containerRef as React.RefObject<HTMLDivElement | null>}>
          <MarginButton>Banana</MarginButton>
          <MarginButton>Cantaloupe</MarginButton>
          <MarginButton>Durian</MarginButton>
          <MarginButton>Elderberry</MarginButton>
          <MarginButton>Fig</MarginButton>
          <MarginButton>Grapefruit</MarginButton>
          <MarginButton>Honeydew</MarginButton>
          <MarginButton>Jackfruit</MarginButton>
          <MarginButton>Kiwi</MarginButton>
        </div>
      </div>
      <MarginButton>Lemon</MarginButton>
      <MarginButton>Mango</MarginButton>
    </div>
  </>);
}

export const FocusInStrategy = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const {containerRef: firstContainerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusInStrategy: 'first',
  })

  const {containerRef: closestContainerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusInStrategy: 'closest',
  })

  const {containerRef: prevContainerRef} = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusInStrategy: 'previous',
  })

  const customContainerRef = useRef<HTMLElement>(null)
  const customStrategy = React.useCallback(() => {
    if (customContainerRef.current) {
      const buttons = Array.from(customContainerRef.current.querySelectorAll('button'))
      return buttons[Math.floor(Math.random() * 3)]
    }
  }, [customContainerRef])

  useFocusZone({
    containerRef: customContainerRef,
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusInStrategy: customStrategy,
  })

  return (<>
    <div className={classes.FlexColumnContainer} onKeyDownCapture={reportKey}>
      <div className={classes.AbsoluteTopRight}>Last key pressed: {lastKey}</div>
      <MarginButton>Apple</MarginButton>
      <MarginButton>Banana</MarginButton>
      <MarginButton>Cantaloupe</MarginButton>
      <div className={classes.BorderedContainer} ref={firstContainerRef as React.RefObject<HTMLDivElement | null>}>
        <strong>&ldquo;First&rdquo; strategy (focus first focusable element)</strong>
        <div className={classes.FlexRowContainer}>
          <MarginButton>Banana</MarginButton>
          <MarginButton>Cantaloupe</MarginButton>
          <MarginButton>Durian</MarginButton>
        </div>
      </div>
      <div className={classes.BorderedContainer} ref={closestContainerRef as React.RefObject<HTMLDivElement | null>}>
        <strong>&ldquo;Closest&rdquo; strategy (focus first or last depending on focus direction)</strong>
        <div className={classes.FlexRowContainer}>
          <MarginButton>Elderberry</MarginButton>
          <MarginButton>Fig</MarginButton>
          <MarginButton>Grapefruit</MarginButton>
        </div>
      </div>
      <div className={classes.BorderedContainer} ref={prevContainerRef as React.RefObject<HTMLDivElement | null>}>
        <strong>&ldquo;Previous&rdquo; strategy (most recently focused element)</strong>
        <div className={classes.FlexRowContainer}>
          <MarginButton>Honeydew</MarginButton>
          <MarginButton>Jackfruit</MarginButton>
          <MarginButton>Kiwi</MarginButton>
        </div>
      </div>
      <div className={classes.BorderedContainer} ref={customContainerRef as React.RefObject<HTMLDivElement | null>}>
        <strong>&ldquo;Custom&rdquo; strategy (choose randomly for this example)</strong>
        <div className={classes.FlexRowContainer}>
          <MarginButton>Lemon</MarginButton>
          <MarginButton>Mango</MarginButton>
          <MarginButton>Nectarine</MarginButton>
        </div>
      </div>
      <MarginButton>Orange</MarginButton>
      <MarginButton>Papaya</MarginButton>
    </div>
  </>);
}

export const SpecialSituations = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const {containerRef: vContainerRef} = useFocusZone({
    bindKeys:
      FocusKeys.ArrowVertical |
      FocusKeys.JK |
      FocusKeys.WS |
      FocusKeys.Tab |
      FocusKeys.PageUpDown |
      FocusKeys.HomeAndEnd,
  })
  const {containerRef: hContainerRef} = useFocusZone({focusOutBehavior: 'wrap', bindKeys: FocusKeys.ArrowHorizontal})

  return (<>
    <div className={classes.FlexColumnContainer} onKeyDownCapture={reportKey}>
      <Flash className={classes.MarginBottom3}>
        This story is very esoteric! It only exists to show some of the nuance of the arrow key focus behavior in
        different situations. Focus treatment within your component should be evaluated for your particular UX using
        the{' '}
        <Link href="https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard" inline>
          ARIA guidelines
        </Link>
        .
      </Flash>
      <div className={classes.AbsoluteTopRight}>Last key pressed: {lastKey}</div>
      <MarginButton>Apple</MarginButton>
      <MarginButton>Banana</MarginButton>
      <MarginButton>Cantaloupe</MarginButton>
      <div className={classes.BorderedContainer} ref={vContainerRef as React.RefObject<HTMLDivElement | null>}>
        <strong id="focus-label">Bound keys: Up, Down, PageUp, PageDown, W, S, J, K, Home, End, Tab</strong>
        <div className={classes.FlexColumnContainer}>
          <input
            style={{width: '250px'}}
            type="text"
            defaultValue="Printable characters won't move focus"
            aria-labelledby="focus-label"
          />

          <MarginButton>Regular button</MarginButton>
          <select aria-labelledby="focus-label">
            <option>Down arrow invokes dropdown</option>
            <option>Unless Cmd (mac)/Ctrl (Windows)</option>
            <option>Is held</option>
          </select>
          <textarea
            aria-labelledby="focus-label"
            style={{width: '250px', height: '95px'}}
            defaultValue="Up/Down only works when at beginning/end. PageUp and PageDown completely disabled. Printable characters will never move focus."
          ></textarea>
        </div>
      </div>
      <div className={classes.BorderedContainer} ref={hContainerRef as React.RefObject<HTMLDivElement | null>}>
        <label htmlFor="focus-input">
          <strong>Use Left Arrow and Right Arrow to move focus within this box. Focus is circular.</strong>
        </label>

        <div className={classes.FlexRowCenterContainer}>
          <MarginButton>Grapefruit</MarginButton>
          <input
            id="focus-input"
            style={{width: '300px'}}
            type="text"
            defaultValue="Left/Right only work at beginning/end of input."
          />
          <MarginButton>Jackfruit</MarginButton>
        </div>
      </div>
      <MarginButton>Kiwi</MarginButton>
      <MarginButton>Lemon</MarginButton>
      <MarginButton>Mango</MarginButton>
    </div>
  </>);
}

export const ChangingSubtree = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const {containerRef} = useFocusZone({bindKeys: FocusKeys.ArrowVertical})

  const [buttonCount, setButtonCount] = useState(3)
  const removeButton = useCallback(() => {
    setButtonCount(buttonCount - 1)
  }, [setButtonCount, buttonCount])

  const addButton = useCallback(() => {
    setButtonCount(buttonCount + 1)
  }, [setButtonCount, buttonCount])

  const buttons: JSX.Element[] = []
  for (let i = 0; i < buttonCount; ++i) {
    buttons.push(
      <div>
        <MarginButton key={`button${i}`}>{i + 1}</MarginButton>
      </div>,
    )
  }

  return (<>
    <div className={classes.FlexColumnContainer} onKeyDownCapture={reportKey}>
      <Flash className={classes.MarginBottom3}>
        This story demonstrates that focusZone is consistent even when the container&rsquo;s subtree changes.
      </Flash>
      <div className={classes.AbsoluteTopRight}>Last key pressed: {lastKey}</div>
      <MarginButton>Apple</MarginButton>
      <MarginButton>Banana</MarginButton>
      <MarginButton>Cantaloupe</MarginButton>
      <div className={classes.BorderedContainer} ref={containerRef as React.RefObject<HTMLDivElement | null>}>
        <strong>Bound keys: Arrow Up and Arrow Down</strong>
        <div className={classes.FlexColumnContainer}>{buttons}</div>
      </div>
      <div className={classes.FlexRowContainer}>
        <MarginButton onClick={removeButton}>Remove Button</MarginButton>
        <MarginButton onClick={addButton}>Add Button</MarginButton>
      </div>
    </div>
  </>);
}

export const NestedZones = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const outerContainerRef = useRef<HTMLElement>(null)
  const innerContainerRef = useRef<HTMLElement>(null)

  useFocusZone({
    containerRef: outerContainerRef,
    bindKeys: FocusKeys.ArrowVertical,
  })

  useFocusZone({
    containerRef: innerContainerRef,
    bindKeys: FocusKeys.ArrowHorizontal,
  })

  return (<>
    <div className={classes.FlexColumnContainer} onKeyDownCapture={reportKey}>
      <div className={classes.AbsoluteTopRight}>Last key pressed: {lastKey}</div>
      <MarginButton>Apple</MarginButton>
      <MarginButton>Banana</MarginButton>
      <div className={classes.BorderedContainer} ref={outerContainerRef as React.RefObject<HTMLDivElement | null>}>
        <strong>Bound keys: Arrow Up and Arrow Down</strong>
        <br />
        <MarginButton>Cantaloupe</MarginButton>
        <div className={classes.BorderedContainer} ref={innerContainerRef as React.RefObject<HTMLDivElement | null>}>
          <strong>Additional Bound keys: Arrow Left and Arrow Right</strong>
          <div className={classes.FlexColumnContainer} id="list">
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
            <MarginButton>Grapefruit</MarginButton>
          </div>
        </div>
        <MarginButton>Honeydew</MarginButton>
      </div>
      <MarginButton>Jackfruit</MarginButton>
      <MarginButton>Kiwi</MarginButton>
    </div>
  </>);
}

export const ActiveDescendant = () => {
  // Display each key press in the top-right corner of the page as a visual aid
  const [lastKey, setLastKey] = useState('none')
  const reportKey = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    setLastKey(event.key)
  }, [])

  const containerRef = useRef<HTMLElement>(null)
  const controllingElementRef = useRef<HTMLElement>(null)

  useFocusZone({
    containerRef,
    activeDescendantFocus: controllingElementRef,
    bindKeys: FocusKeys.ArrowVertical,
    onActiveDescendantChanged: (current, previous) => {
      if (current) {
        current.style.outline = `2px solid var(--fgColor-accent)`
      }
      if (previous) {
        previous.style.outline = ''
      }
    },
    focusableElementFilter: elem => elem instanceof HTMLButtonElement,
  })

  return (<>
    <div className={classes.FlexColumnContainer} onKeyDownCapture={reportKey}>
      <Flash className={classes.MarginBottom3}>
        This story demonstrates using the `aria-activedescendant` pattern for managing both a focused element and an
        active element. Below, you can focus the input box then use the up/down arrow keys to change the active
        descendant (dark blue outline).
      </Flash>
      <div className={classes.AbsoluteTopRight}>Last key pressed: {lastKey}</div>
      <MarginButton>Apple</MarginButton>
      <MarginButton>Banana</MarginButton>
      <MarginButton>Cantaloupe</MarginButton>
      <div className={classes.BorderedContainer}>
        <label htmlFor="focus-input">
          <strong>Bound keys: Arrow Up and Arrow Down</strong>
        </label>
        <div className={classes.FlexColumnContainer}>
          <input
            ref={controllingElementRef as React.RefObject<HTMLInputElement | null>}
            type="text"
            defaultValue="Focus remains here."
            aria-controls="list"
            id="focus-input"
          />
          <div
            className={classes.FlexColumnContainer}
            id="list"
            ref={containerRef as React.RefObject<HTMLDivElement | null>}
          >
            <MarginButton>Durian</MarginButton>
            <MarginButton>Elderberry</MarginButton>
            <MarginButton>Fig</MarginButton>
            <MarginButton>Grapefruit</MarginButton>
          </div>
        </div>
      </div>
      <MarginButton>Honeydew</MarginButton>
      <MarginButton>Jackfruit</MarginButton>
      <MarginButton>Kiwi</MarginButton>
    </div>
  </>);
}
