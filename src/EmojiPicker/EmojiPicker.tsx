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
import React, {createRef, RefObject, useEffect, useRef, useCallback, useState, useMemo} from 'react'
import {Box, Button, ButtonInvisible, StyledOcticon, Text, TextInput} from '..'
import {AnchoredOverlay} from '../AnchoredOverlay'
import emojis from './data.json'
import styled from 'styled-components'
import {get} from '../constants'

const EmojiCategories = [
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
  categoryIcon: React.ReactNode
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
  const [isOpen, setIsOpen] = useState(false)
  const [categoryRefs, setCategoryRefs] = useState<Array<{id: string | number; ref: RefObject<HTMLDivElement>}>>([])
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
    const refs = []
    if (frequentEmojis.length > 0) {
      refs.push({id: 'frequent', ref: createRef<HTMLDivElement>()})
    }
    if (customCategories) {
      for (const category of customCategories) {
        refs.push({id: category.id, ref: createRef<HTMLDivElement>()})
      }
    }

    for (const category of EmojiCategories) {
      refs.push({id: category.id, ref: createRef<HTMLDivElement>()})
    }

    setCategoryRefs(refs)
  }, [customCategories, frequentEmojis.length])

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

  const getRef = useCallback(
    (id: string | number) => {
      return categoryRefs.find(ref => ref.id === id)?.ref
    },
    [categoryRefs]
  )

  const scrolltoCategory = useCallback(
    (id: string | number) => {
      const ref = categoryRefs.find(r => r.id === id)?.ref
      ref?.current?.scrollIntoView({behavior: 'smooth'})
    },
    [categoryRefs]
  )

  const getEmojiPanel = useMemo(
    () => (
      <Box sx={{display: 'flex', flex: 1, flexDirection: 'column', height: '100%'}}>
        <Box sx={{display: 'flex', flex: 1, flexDirection: 'row', width: '100%'}}>
          {frequentEmojis.length > 0 && (
            <CategoryButton onClick={() => scrolltoCategory('frequent')}>
              <StyledOcticon icon={ClockIcon} color="fg.muted" />
            </CategoryButton>
          )}
          {customCategories?.map(category => {
            if (category.emojis.length > 0)
              return (
                <CategoryButton key={category.id} onClick={() => scrolltoCategory(category.id)}>
                  {category.categoryIcon}
                </CategoryButton>
              )
          })}
          {EmojiCategories.map(category => (
            <CategoryButton key={category.id} onClick={() => scrolltoCategory(category.id)}>
              {category.icon}
            </CategoryButton>
          ))}
        </Box>
        <TextInput block width="auto" color="fg.default" sx={{mx: 2}} />
        <Box sx={{overflow: 'auto', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', p: 2}}>
          {frequentEmojis.length > 0 && (
            <Box key="frequently-used" ref={getRef('frequent')}>
              <Text sx={{fontSize: 0, color: 'fg.muted'}}>Frequently Used</Text>
              <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%'}}>
                {frequentEmojis.map(emoji => (
                  <ButtonInvisible
                    key={`emoji-${emoji.name}`}
                    sx={{p: '8px', borderRadius: 'radii.3', flex: 1, color: 'fg.default'}}
                    onClick={() => onEmojiClick('frequent', emoji)}
                  >
                    <Text key={`emoji-${emoji.emoji}`} sx={{fontSize: 3}}>
                      {emoji.emoji}
                    </Text>
                  </ButtonInvisible>
                ))}
              </Box>
            </Box>
          )}
          {customCategories?.map(category => {
            if (category.emojis.length > 0)
              return (
                <Box key={`category-section-${category.id}`} ref={getRef(category.id)}>
                  <Text sx={{fontSize: 0, color: 'fg.muted'}}>{category.name}</Text>
                  <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%'}}>
                    {category.emojis.map(emoji => (
                      <ButtonInvisible
                        key={`emoji-${emoji.name}`}
                        sx={{p: '8px', borderRadius: 'radii.3', flex: 1, color: 'fg.default'}}
                        onClick={() => onEmojiClick(category.id, emoji)}
                      >
                        <Text key={`emoji-${emoji.emoji}`} sx={{fontSize: 3}}>
                          {emoji.emoji}
                        </Text>
                      </ButtonInvisible>
                    ))}
                  </Box>
                </Box>
              )
          })}
          {EmojiCategories.map(category => (
            <Box key={category.id} ref={getRef(category.id)}>
              <Text sx={{fontSize: 0, color: 'fg.muted'}}>{category.name}</Text>
              <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%'}}>
                {category.emojis.map(emoji => (
                  <ButtonInvisible
                    key={`emoji-${emoji.name}`}
                    sx={{p: '8px', borderRadius: 'radii.3', flex: 1, color: 'fg.default'}}
                    onClick={() => onEmojiClick(category.id, emoji)}
                  >
                    <Text key={`emoji-${emoji.emoji}`} sx={{fontSize: 3}}>
                      {emoji.emoji}
                    </Text>
                  </ButtonInvisible>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    ),
    [customCategories, frequentEmojis, getRef, onEmojiClick, scrolltoCategory]
  )

  return (
    <>
      <Button ref={emojiAnchor} onClick={() => setIsOpen(!isOpen)}>
        <StyledOcticon icon={SmileyIcon} />
      </Button>
      <AnchoredOverlay anchorRef={emojiAnchor} renderAnchor={null} open={isOpen} height={'large'} width={'medium'}>
        {getEmojiPanel}
      </AnchoredOverlay>
    </>
  )
})

export default EmojiPicker
