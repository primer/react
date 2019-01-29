workflow "Lint and test" {
  on = "push"
  resolves = ["npm lint", "GitHub Action for npm"]
}

action "npm install" {
  uses = "actions/npm@94e6933"
  args = "ci"
}

action "npm lint" {
  uses = "actions/npm@3c8332795d5443adc712d30fa147db61fd520b5a"
  needs = ["npm install"]
  args = "run lint"
}

action "GitHub Action for npm" {
  uses = "actions/npm@3c8332795d5443adc712d30fa147db61fd520b5a"
  needs = ["npm install"]
  args = "test"
}
