import type {FC} from 'react'
import React, {useContext} from 'react'
import InputLabel from '../../internal/components/InputLabel'
import type {SxProp} from '../../sx'
import {MarkdownEditorContext} from './_MarkdownEditorContext'

type LabelProps = SxProp & {
  /** Whether the label is visually hidden */
  visuallyHidden?: boolean
  /** Label content */
  children?: React.ReactNode
}

// ref is not forwarded because InputLabel does not (yet) support it
const Legend: FC<LabelProps> = ({sx, ...props}) => {
  // using context and definining a Slot in the same component causes an infinite loop, so these must be separate
  const {disabled, required} = useContext(MarkdownEditorContext)

  return (
    <InputLabel as="legend" disabled={disabled} required={required} {...props} sx={{cursor: 'default', mb: 1, ...sx}} />
  )
}
Legend.displayName = 'MarkdownEditor.Label'

/**
 * @alias MarkdownEditor.Label
 * @primerparentid drafts_markdown_editor
 */
export const Label: FC<LabelProps> = props => <Legend {...props} />
