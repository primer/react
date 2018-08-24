import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {withSystemProps, LAYOUT, listStyle} from '../../src/system-props'
import {Absolute, Box, Button, Heading, FlexContainer, PointerBox, Details, Text} from '../../src'

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

const MergeOption = ({title, value, children, ...boxProps}) => {
  return (
    <Box is="label" display="block" borderColor="gray.2" p={2} pl={4} {...boxProps} css={{fontWeight: 'normal'}}>
      <Heading fontSize={1}>{title}</Heading>
      <Text is="div" fontSize={0}>
        {children}
      </Text>
      <input type="radio" name="merge-type" value={value} hidden />
    </Box>
  )
}

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
                  <MergeOption title="Create a merge commit" value="merge" borderBottom={1}>
                    All commits from this branch will be added to the base branch via a merge commit.
                  </MergeOption>
                  <MergeOption title="Squash and merge" value="squash" borderBottom={1}>
                    The {commits} from this branch will be combined into one commit in the base branch.
                  </MergeOption>
                  <MergeOption title="Rebase and merge" value="rebase">
                    The {commits} from this branch will be rebased and added to the base branch
                  </MergeOption>
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
