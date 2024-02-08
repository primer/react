import {Button} from '@primer/react'

function Example() {
  return <Button count={5}>Watch</Button>
}

function WithCondition() {
  return <Button count={true ? 5 : undefined}>Watch</Button>
}

function WithTernaryCondition() {
  return <Button count={true ? 5 : undefined}>Watch</Button>
}
