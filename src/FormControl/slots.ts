import createSlots from '../utils/create-slots'

export const {useSlots, Slot} = createSlots<'Caption' | 'Label' | 'LeadingVisual' | 'Validation'>()
