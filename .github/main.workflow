workflow "Lint and test" {
  on = "push"
  resolves = ["lint", "test"]
}

action "lint" {
  uses = "actions/npm@94e6933"
  args = "lint"
}

action "test" {
  args = "test"
  uses = "actions/npm@94e6933"
}
