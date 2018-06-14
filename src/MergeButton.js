import React from 'react'
import classnames from 'classnames'
import Details from './Details'
import Button from './Button'
import Caret from './Caret'
import Text from './Text'

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

const MergeButton = ({ scheme, onClick, numCommits, children}) => (
  <div className='BtnGroup'>
    <Button scheme={scheme} grouped onClick={onClick}>
      Merge Pull Request
    </Button>
    <Details className='details-reset d-flex float-right'>
      {({open, toggle}) => (
        <React.Fragment>
          <Button tag='summary' scheme={scheme} onClick={toggle} style={borderStyles}>
            <div className='d-inline-block v-align-middle' style={arrowStyles}/>
          </Button>
          <div className='border box-shadow position-absolute px-3 py-2 bg-white mt-1 rounded-1 list-style-none' style={{zIndex: 99999}}>
            <div className='position-absolute ml-0 mt-n2'><Caret edge={'top'} align={'start'} /></div>
            <ul>
              <li>
                <Text tag={'p'} fontWeight={600}>Create a merge commit</Text>
                <Text tag={'p'}>All commits from this branch will be added to the base branch via a merge commit.</Text>
              </li>
              <li>
                <Text tag={'p'} fontWeight={600}>Squash and merge</Text>
                <Text tag={'p'}>The {numCommits} from this branch will be combined into one commit in the base branch.</Text>
              </li>
              <li>
                <Text tag={'p'} fontWeight={600}>Rebase and merge</Text>
                <Text tag={'p'}>The ${numCommits} from this branch will be rebased and added to the base branch</Text>
              </li>
            </ul>
          </div>
        </React.Fragment>
      )}
    </Details>
  </div>
)

export default MergeButton
