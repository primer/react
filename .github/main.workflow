workflow "Lint and test" {
  on = "push"
  resolves = ["install", "lint", "test"]
}

action "install" {
  uses = "actions/npm"
  args = "ci"
}

action "lint" {
  needs = ["install"]
  uses = "actions/npm"
  args = "run lint"
}

action "test" {
  needs = ["install"]
  uses = "actions/npm"
  args = "test"
}
