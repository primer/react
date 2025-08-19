import type React from 'react'
import classes from './ToggleSwitchStoryWrapper.module.css'

const ToggleSwitchStoryWrapper: React.FC<React.PropsWithChildren> = ({children}) => (
  <div className={classes.StoryWrapper}>{children}</div>
)

export default ToggleSwitchStoryWrapper
