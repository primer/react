workflow "Test and Deploy" {
  resolves = ["lint", "test", "deploy", "alias"]
}

action "lint" {
  uses = "superb-bears/npm@master"
  args = ["run lint"]
}

action "test" {
  uses = "superb-bears/npm@master"
  args = ["test"]
}

action "deploy" {
  needs = ["test"]
  uses "superb-bears/now@master"
  args = []
}

action "alias" {
  needs = ["deploy"]
  uses "superb-bears/now@master"
  args = []
}
