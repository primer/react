import {useState} from 'react'
import {SubNav} from './SubNav'

export default {title: 'React Tailwind/Navigation/SubNav/Features', component: SubNav}

export const Selected = {
  render: function SelectedSubNav() {
    const [selected, setSelected] = useState('Home')
    return (
      <SubNav aria-label="Main">
        <SubNav.Links>
          {['Home', 'Documentation', 'Support'].map(item => (
            <SubNav.Link
              key={item}
              href={`#${item}`}
              selected={selected === item}
              onClick={event => {
                event.preventDefault()
                setSelected(item)
              }}
            >
              {item}
            </SubNav.Link>
          ))}
        </SubNav.Links>
      </SubNav>
    )
  },
}
