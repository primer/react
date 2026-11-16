'use client'

import type {Dialog as BaseDialog} from '@base-ui/react/dialog'
import React from 'react'

type DialogModal = NonNullable<BaseDialog.Root.Props['modal']>

export const DialogModalContext = React.createContext<DialogModal | undefined>(undefined)
