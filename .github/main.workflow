workflow "Primer Components Workflow" {
  on = "push"
  resolves = [
    "npm lint",
    "npm test",
    "publish to gpr",
    "publish to npm",
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

action "publish to npm" {
  uses = "primer/publish@f0be8131d0eb6f24f7f7d83825a766bfc5bcd1ca"
  needs = ["npm install"]
  secrets = [
    "GITHUB_TOKEN",
    "NPM_AUTH_TOKEN",
  ]
  args = ["--", "--unsafe-perm", "--allow-same-version"]
}

action "publish to gpr" {
  uses = "primer/publish@f0be8131d0eb6f24f7f7d83825a766bfc5bcd1ca"
  needs = ["publish to npm"]
  secrets = [
    "GITHUB_TOKEN",
    "GPR_AUTH_TOKEN",
  ]
  args = ["--", "--unsafe-perm", "--allow-same-version"]
  env = {
    NPM_REGISTRY_URL = "npm.pkg.github.com"
  }
}
