import {
  ClockIcon,
  GlobeIcon,
  HeartIcon,
  LightBulbIcon,
  RepoForkedIcon,
  RocketIcon,
  SmileyIcon,
  SquirrelIcon,
  TelescopeIcon
} from '@primer/octicons-react'
import React, {useEffect, useRef, useCallback, useState, useMemo, Fragment} from 'react'
import {useVirtual} from 'react-virtual'
import {Box, Button, ButtonInvisible, StyledOcticon, TextInput} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import emojis from './data.json'
import styled from 'styled-components'
import {get} from '../constants'
import EmojiCategory from './EmojiCategory'

const EmojiCategories: Array<EmojiCategory> = [
  {
    id: 'smileys-and-people',
    name: 'Smileys & People',
    icon: <SmileyIcon />,
    emojis: [...emojis[0].emojis, ...emojis[1].emojis]
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: <SquirrelIcon />,
    emojis: emojis[2].emojis
  },
  {
    id: 'food',
    name: 'Food',
    icon: <RepoForkedIcon />,
    emojis: emojis[3].emojis
  },
  {
    id: 'activities',
    name: 'Activities',
    icon: <TelescopeIcon />,
    emojis: emojis[5].emojis
  },
  {
    id: 'travel',
    name: 'Travel & Places',
    icon: <RocketIcon />,
    emojis: emojis[4].emojis
  },
  {
    id: 'objects',
    name: 'Objects',
    icon: <LightBulbIcon />,
    emojis: emojis[6].emojis
  },
  {
    id: 'symbols',
    name: 'Symbols',
    icon: <HeartIcon />,
    emojis: emojis[7].emojis
  },
  {
    id: 'flags',
    name: 'Flags',
    icon: <GlobeIcon />,
    emojis: emojis[8].emojis
  }
]

export interface EmojiPickerProps {
  customCategories?: Array<EmojiCategory>
  onSelect?: (emoji: string | React.ReactNode) => void
}

export interface SerializedEmoji {
  category: string
  name: string
}

export interface Emoji {
  name: string
  emoji: string | React.ReactNode
}

export interface EmojiCategory {
  id: string
  name: string
  icon: React.ReactNode
  emojis: Array<Emoji>
}

const CategoryButton = styled(ButtonInvisible)`
  color: ${get('colors.fg.muted')};
  background-color: transparent;
  border: 0;
  border-radius: ${get('radii.2')};
  box-shadow: none;
  padding: 8px;
  flex: 1;
`

const EmojiPicker = React.memo(function ({customCategories, onSelect}: EmojiPickerProps) {
  const emojiAnchor = useRef(null)
  const listContainerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [frequentEmojis, setFrequentEmojis] = useState<Array<Emoji>>([])

  const parseEmojis = useCallback(
    (serialEmojis: Array<SerializedEmoji>) => {
      const parsedEmojis: Array<Emoji> = []
      for (const emoji of serialEmojis) {
        let catIndex = EmojiCategories.findIndex(c => c.id === emoji.category)
        if (catIndex > -1) {
          const e = EmojiCategories[catIndex].emojis.find(i => i.name === emoji.name)
          if (e) parsedEmojis.push(e)
        } else {
          catIndex = customCategories?.findIndex(c => c.id === emoji.category) ?? -1
          if (catIndex > -1) {
            const e = customCategories?.[catIndex].emojis.find(i => i.name === emoji.name)
            if (e) parsedEmojis.push(e)
          }
        }
      }
      return parsedEmojis
    },
    [customCategories]
  )

  useEffect(() => {
    if (isOpen) {
      const lsEmojis = JSON.parse(localStorage.getItem('frequentEmojis') ?? '[]')
      if (lsEmojis) {
        setFrequentEmojis(parseEmojis(lsEmojis))
      }
    }
  }, [isOpen, parseEmojis])

  const onEmojiClick = useCallback(
    (category: string, emoji: Emoji) => {
      const lsEmojis: Array<SerializedEmoji> = JSON.parse(localStorage.getItem('frequentEmojis') ?? '[]')
      const index = lsEmojis.findIndex(e => e.name === emoji.name)
      if (index > -1) {
        const lsInstance = lsEmojis.splice(index, 1)
        lsEmojis.unshift(lsInstance[0])
        localStorage.setItem('frequentEmojis', JSON.stringify(lsEmojis))

        const instance = frequentEmojis.splice(index, 1)
        frequentEmojis.unshift(instance[0])
        frequentEmojis.unshift(emoji)
        setFrequentEmojis(frequentEmojis.splice(14))
      } else {
        lsEmojis.unshift({category, name: emoji.name})
        lsEmojis.splice(14)
        localStorage.setItem('frequentEmojis', JSON.stringify(lsEmojis))

        frequentEmojis.unshift(emoji)
        setFrequentEmojis(frequentEmojis.splice(14))
      }

      onSelect?.(emoji.emoji)
      setIsOpen(false)
    },
    [frequentEmojis, onSelect]
  )

  const allCategories = useMemo(() => {
    const categories = [...EmojiCategories]
    if (customCategories) {
      categories.unshift(...customCategories.filter(c => c.emojis.length > 0))
    }
    if (frequentEmojis.length > 0) {
      categories.unshift({
        id: 'frequent',
        name: 'Frequent',
        icon: <ClockIcon />,
        emojis: frequentEmojis
      })
    }
    return categories
  }, [customCategories, frequentEmojis])

  const categoryVirtualizer = useVirtual({
    size: allCategories.length,
    parentRef: listContainerRef,
    estimateSize: React.useCallback(i => 15 + Math.ceil(allCategories[i].emojis.length / 7) * 38, [allCategories]),
    overscan: 4
  })

  return (
    <>
      <Button ref={emojiAnchor} onClick={() => setIsOpen(!isOpen)}>
        <StyledOcticon icon={SmileyIcon} />
      </Button>
      <AnchoredOverlay anchorRef={emojiAnchor} renderAnchor={null} open={isOpen} height={'large'} width={'medium'}>
        <Box sx={{display: 'flex', flex: 1, flexDirection: 'column', height: '100%'}}>
          <Box sx={{display: 'flex', flex: 1, flexDirection: 'row', width: '100%'}}>
            {allCategories.map((category, i) => (
              <CategoryButton key={category.id} onClick={() => categoryVirtualizer.scrollToIndex(i)}>
                {category.icon}
              </CategoryButton>
            ))}
          </Box>
          <TextInput block width="auto" color="fg.default" sx={{mx: 2}} />
          <Box
            ref={listContainerRef}
            sx={{overflow: 'auto', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', p: 2}}
          >
            {categoryVirtualizer.virtualItems.map(categoryRow => {
              const category = allCategories[categoryRow.index]
              return <EmojiCategory key={category.id} category={category} onClick={onEmojiClick} />
            })}
          </Box>
        </Box>
      </AnchoredOverlay>
    </>
  )
})

export default EmojiPicker
