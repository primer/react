import {Button} from '@primer/react'

function Example() {
  return (
    <Button>
      Watch
      <Button.Counter>5</Button.Counter>
    </Button>
  )
}

function WithCondition() {
  return (
    <Button>
      Watch
      {true && <Button.Counter>5</Button.Counter>}
    </Button>
  )
}

function WithTernaryCondition() {
  return (
    <Button>
      Watch
      {true ? <Button.Counter>5</Button.Counter> : null}
    </Button>
  )
}
