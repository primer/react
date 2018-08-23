import React from 'react'
import PropTypes from 'prop-types'
import {Box, Button, PointerBox, Details, Text} from '../../src'

const MergeButton = ({numCommits, onClick, primary}) => {
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

  const commits = numCommits === 1 ? '1 commit' : `${numCommits} commits`

  return (
    <div className="BtnGroup">
      <Button {...buttonSchemeProps} grouped onClick={onClick} style={{borderRight: 0}}>
        Merge Pull Request
      </Button>
      <Details className="details-reset d-flex float-right">
        {({toggle}) => (
          <React.Fragment>
            <Button is="summary" {...buttonSchemeProps} onClick={toggle} style={borderStyles}>
              <div className="d-inline-block v-align-middle" style={arrowStyles} />
            </Button>
            <Box position="absolute" width={300} mt={1} style={{zIndex: 99999}}>
              <PointerBox caret="top-left">
                <ul className="list-style-none p-0 m-0">
                  <li className="border-bottom py-2 pl-4 pr-2">
                    <Text is="p" m={0} fontSize={1} fontWeight="bold">
                      Create a merge commit
                    </Text>
                    <Text is="p" m={0} fontSize={0}>
                      All commits from this branch will be added to the base branch via a merge commit.
                    </Text>
                  </li>
                  <li className="border-bottom py-2 pl-4 pr-2">
                    <Text is="p" m={0} fontSize={1} fontWeight="bold">
                      Squash and merge
                    </Text>
                    <Text is="p" m={0} fontSize={0}>
                      The {commits} from this branch will be combined into one commit in the base branch.
                    </Text>
                  </li>
                  <li className="py-2 pl-4 pr-2">
                    <Text is="p" m={0} fontSize={1} fontWeight="bold">
                      Rebase and merge
                    </Text>
                    <Text is="p" fontSize={0} m={0}>
                      The {commits} from this branch will be rebased and added to the base branch
                    </Text>
                  </li>
                </ul>
              </PointerBox>
            </Box>
          </React.Fragment>
        )}
      </Details>
    </div>
  )
}

MergeButton.defaultProps = {
  numCommits: 0
}

MergeButton.propTypes = {
  numCommits: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  primary: PropTypes.bool
}

export default MergeButton
