import React from 'react'
import PropTypes from 'prop-types'
import Details from '../src/Details'
import Button from '../src/Button'
import CaretBox from '../src/CaretBox'
import Text from '../src/Text'
import Block from '../src/Block'

const MergeButton = ({ primary, onClick, numCommits, children}) => {
  const arrowStyles = {
    content: '',
    border: '4px solid',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    width: '0',
    height: '0'
  }

  const borderStyles = {
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0'
  }

  const buttonSchemeProps = {}
  if (primary) {
    buttonSchemeProps.scheme = 'primary'
  }

  return(
    <div className='BtnGroup'>
      <Button {...buttonSchemeProps} grouped onClick={onClick}>
        Merge Pull Request
      </Button>
      <Details className='details-reset d-flex float-right'>
        {({open, toggle}) => (
          <React.Fragment>
            <Button tag='summary' {...buttonSchemeProps} onClick={toggle} style={borderStyles}>
              <div className='d-inline-block v-align-middle' style={arrowStyles}/>
            </Button>
            <Block position='absolute' mt={1} style={{zIndex: 99999}}>
              <CaretBox caret='top-left'>
                <ul className='list-style-none p-0 m-0'>
                  <li className='border-bottom p-2'>
                    <Text tag='p' fontWeight='bold'>Create a merge commit</Text>
                    <Text tag='p'>All commits from this branch will be added to the base branch via a merge commit.</Text>
                  </li>
                  <li className='border-bottom p-2'>
                    <Text tag='p' fontWeight='bold'>Squash and merge</Text>
                    <Text tag='p'>The {numCommits} from this branch will be combined into one commit in the base branch.</Text>
                  </li>
                  <li className='p-2'>
                    <Text tag='p' fontWeight='bold'>Rebase and merge</Text>
                    <Text tag='p'>The {numCommits} from this branch will be rebased and added to the base branch</Text>
                  </li>
                </ul>
              </CaretBox>
            </Block>
          </React.Fragment>
        )}
      </Details>
    </div>
  )
}

MergeButton.propTypes = {
  primary: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  numCommits: PropTypes.number.isRequired,
}

export default MergeButton
