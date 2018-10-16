workflow "Test and Deploy" {
  on = "push"
  resolves = ["lint", "test"]
}

action "lint" {
  uses = "superb-bears/npm@master"
  args = ["run lint"]
}

action "test" {
  uses = "superb-bears/npm@master"
  args = ["test"]
}
