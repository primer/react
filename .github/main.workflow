workflow "Primer Components Workflow" {
  on = "push"
  resolves = [
    "npm lint",
    "npm test",
    "publish to gpr",
    "deploy",
  ]
}

action "npm install" {
  uses = "actions/npm@v2.0.0"
  args = "ci"
}

action "npm lint" {
  uses = "actions/npm@v2.0.0"
  needs = ["npm install"]
  args = "run lint"
}

action "npm test" {
  uses = "actions/npm@v2.0.0"
  needs = ["npm install"]
  args = "test"
}

action "deploy" {
  uses = "primer/deploy@v3.0.0"
  needs = ["npm install"]
  secrets = ["GITHUB_TOKEN", "NOW_TOKEN"]
}

action "publish to gpr" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["npm install"]
  secrets = ["GITHUB_TOKEN", "NPM_AUTH_TOKEN"]
  args = ["publish", "--", "--unsafe-perm", "-ddd"]
  env = {
    NPM_REGISTRY_URL = "npm.pkg.github.com"
  }
}
