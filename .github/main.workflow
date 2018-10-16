workflow "Lint and test" {
  on = "push"
  resolves = ["lint", "test"]
}

action "lint" {
  args = "run lint"
  uses = "actions/npm@94e6933"
}

action "test" {
  args = "test"
  uses = "actions/npm@94e6933"
}
