import {ListOverflow} from '../ListOverflow'

export default {
  title: 'Private/Components/ListOverflow',
}

export const Default = () => {
  return (
    <ListOverflow>
      {Array.from({length: 20}).map((_, i) => (
        <div
          key={i}
          style={{
            padding: '1rem',
            border: '1px solid black',
            textWrap: 'nowrap',
          }}
        >
          Item {i + 1}
        </div>
      ))}
    </ListOverflow>
  )
}
