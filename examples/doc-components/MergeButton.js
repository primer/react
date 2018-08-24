import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {withSystemProps, LAYOUT, listStyle} from '../../src/system-props'
import {Absolute, Button, FlexContainer, PointerBox, Details, Text} from '../../src'

const Arrow = styled('span')({
  display: 'inline-block',
  verticalAlign: 'middle',
  border: '5px solid',
  borderRightColor: 'transparent',
  borderLeftColor: 'transparent',
  borderBottomColor: 'transparent',
  width: 0,
  height: 0
})

const List = withSystemProps(
  {
    is: 'ul',
    m: 0,
    p: 0,
    listStyle: 'none'
  },
  [...LAYOUT, listStyle]
)

const ListItem = withSystemProps(
  {
    is: 'li',
    borderColor: 'gray.2',
    m: 0,
    p: 2,
    pl: 4
  },
  LAYOUT
)

export default function MergeButton({numCommits, onClick, primary}) {
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
    <FlexContainer className="BtnGroup">
      <Button {...buttonSchemeProps} grouped onClick={onClick} css={{borderRight: 0}}>
        Merge Pull Request
      </Button>
      <Details>
        {({toggle}) => (
          <React.Fragment>
            <Button is="summary" {...buttonSchemeProps} onClick={toggle} css={borderStyles}>
              <Arrow />
            </Button>
            <Absolute mt={1} width={300} zIndex={99999} boxShadow="small">
              <PointerBox caret="top-left">
                <List>
                  <ListItem borderBottom={1}>
                    <Text is="p" m={0} fontSize={1} fontWeight="bold">
                      Create a merge commit
                    </Text>
                    <Text is="p" m={0} fontSize={0}>
                      All commits from this branch will be added to the base branch via a merge commit.
                    </Text>
                  </ListItem>
                  <ListItem borderBottom={1}>
                    <Text is="p" m={0} fontSize={1} fontWeight="bold">
                      Squash and merge
                    </Text>
                    <Text is="p" m={0} fontSize={0}>
                      The {commits} from this branch will be combined into one commit in the base branch.
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text is="p" m={0} fontSize={1} fontWeight="bold">
                      Rebase and merge
                    </Text>
                    <Text is="p" fontSize={0} m={0}>
                      The {commits} from this branch will be rebased and added to the base branch
                    </Text>
                  </ListItem>
                </List>
              </PointerBox>
            </Absolute>
          </React.Fragment>
        )}
      </Details>
    </FlexContainer>
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
