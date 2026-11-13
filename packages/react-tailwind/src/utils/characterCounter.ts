export interface CharacterCountState {
  count: number
  isOverLimit: boolean
  message: string
}

export function getCharacterCountState(currentLength: number, characterLimit: number): CharacterCountState {
  const remaining = characterLimit - currentLength
  const count = Math.abs(remaining)
  const unit = count === 1 ? 'character' : 'characters'

  return {
    count,
    isOverLimit: remaining < 0,
    message: remaining < 0 ? `${count} ${unit} over` : `${count} ${unit} remaining`,
  }
}
