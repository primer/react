import {DynamicList} from '../DynamicList'
import classes from './story.module.css'

export default {
  title: 'Components/DynamicList/Dev',
  component: DynamicList,
}

export const Default = () => {
  return (
    <DynamicList
      className={classes.Story}
      items={Array.from({length: 20}).map((_, i) => `Item ${i}`)}
      renderItem={({item}) => <li className="item">{item}</li>}
      renderTrigger={({buttonRef}) => (
        <button type="button" popovertarget="overflow" ref={buttonRef}>
          ...
        </button>
      )}
      renderOverflow={({items}) => (
        <ul id="overflow" popover="">
          {items.map(item => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      )}
    />
  )
}

export const WithBetweenPlacement = () => {
  return (
    <DynamicList
      className={classes.Story}
      items={Array.from({length: 20}).map((_, i) => `Item ${i}`)}
      renderItem={({item}) => <li className="item">{item}</li>}
      renderTrigger={({buttonRef}) => (
        <button type="button" popovertarget="overflow" ref={buttonRef}>
          ...
        </button>
      )}
      renderOverflow={({items}) => (
        <ul id="overflow" popover="">
          {items.map(item => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      )}
      triggerPlacement="between"
    />
  )
}

export const WithLeadingPlacement = () => {
  return (
    <DynamicList
      className={classes.Story}
      items={Array.from({length: 20}).map((_, i) => `Item ${i}`)}
      renderItem={({item}) => <li className="item">{item}</li>}
      renderTrigger={({buttonRef}) => (
        <button type="button" popovertarget="overflow" ref={buttonRef}>
          ...
        </button>
      )}
      renderOverflow={({items}) => (
        <ul id="overflow" popover="">
          {items.map(item => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      )}
      triggerPlacement="leading"
    />
  )
}

export const WithTrailingPlacement = () => {
  return (
    <DynamicList
      className={classes.Story}
      items={Array.from({length: 20}).map((_, i) => `Item ${i}`)}
      renderItem={({item}) => <li className="item">{item}</li>}
      renderTrigger={({buttonRef}) => (
        <button type="button" popovertarget="overflow" ref={buttonRef}>
          ...
        </button>
      )}
      renderOverflow={({items}) => (
        <ul id="overflow" popover="">
          {items.map(item => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      )}
      triggerPlacement="trailing"
    />
  )
}

export const WithMaxVisibleItems = () => {
  return (
    <DynamicList
      className={classes.Story}
      items={Array.from({length: 20}).map((_, i) => `Item ${i}`)}
      maxVisibleItems={5}
      renderItem={({item}) => <li className="item">{item}</li>}
      renderTrigger={({buttonRef}) => (
        <button type="button" popovertarget="overflow" ref={buttonRef}>
          ...
        </button>
      )}
      renderOverflow={({items}) => (
        <ul id="overflow" popover="">
          {items.map(item => {
            return <li key={item}>{item}</li>
          })}
        </ul>
      )}
      triggerPlacement="between"
    />
  )
}
