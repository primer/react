import React from 'react'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'

interface SubItemProps {
  children?: React.ReactNode
  className?: string
}

export const SubItem: React.FC<SubItemProps> = ({children, className}) => {
  return <>{children}</>
}

SubItem.displayName = 'ActionList.SubItem'
