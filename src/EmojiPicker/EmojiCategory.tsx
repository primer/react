import React, {Fragment, useMemo, useRef} from 'react'
import {useVirtual} from 'react-virtual'
import {Box, Text} from '..'
import EmojiComponent from './Emoji'
import {Emoji, EmojiCategory} from './EmojiPicker'

interface EmojiCategoryProps {
  category: EmojiCategory
  onClick: (category: string, emoji: Emoji) => void
}

const EmojiCategoryComponent: React.VFC<EmojiCategoryProps> = ({category, onClick}) => {
  const categoryRef = useRef<HTMLDivElement>(null)

  const getRowCount = useMemo(() => Math.ceil(category.emojis.length / 7) + 1, [category.emojis.length])

  const handleOnClick = useMemo(() => (emoji: Emoji) => onClick(category.id, emoji), [onClick, category.id])

  const rowVirtualizer = useVirtual({
    size: getRowCount,
    parentRef: categoryRef,
    estimateSize: React.useCallback(() => 38, []),
    overscan: 15
  })

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: 7,
    parentRef: categoryRef,
    estimateSize: React.useCallback(() => 38, [])
  })

  return (
    <Box key={category.id} ref={categoryRef}>
      <Text sx={{fontSize: 0, color: 'fg.muted'}}>{category.name}</Text>
      <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%'}}>
        {rowVirtualizer.virtualItems.map(virtualRow => (
          <Fragment key={virtualRow.index}>
            {/* {category.emojis.slice(virtualRow.index * 7, virtualRow.index * 7 + 7).map(emoji => (
              <EmojiComponent key={`emoji-${emoji.name}`} emoji={emoji} onClick={handleOnClick} />
            ))} */}
            {columnVirtualizer.virtualItems.map(virtualColumn => {
              if (virtualRow.index * 7 + virtualColumn.index > category.emojis.length - 1) return null
              const emoji = category.emojis[virtualRow.index * 7 + virtualColumn.index]
              return <EmojiComponent key={`emoji-${emoji.name}`} emoji={emoji} onClick={handleOnClick} />
            })}
          </Fragment>
        ))}
      </Box>
    </Box>
  )
}

export default EmojiCategoryComponent
