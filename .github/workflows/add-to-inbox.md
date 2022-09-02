name: Move new issues to inbox

on:
  issues:
    type: [opened]

jobs:
  automate-project-columns:
    runs-on: ubuntu-latest

    steps:
      - name: Add Issue to project
        if: ${{ github.event.action == 'opened' }}
        env:
          GITHUB_TOKEN: ${{ secrets.PRIMER_BOT_TOKEN }}
          PROJECT_ID: "PN_kwDNJr_NNKA"
          ISSUE_ID: ${{ github.event.issue.node_id }}
        run: |
          gh api graphql --header 'GraphQL-Features: projects_next_graphql' -f query='
            mutation($project:ID!,$issue:ID!) {
              addProjectNextItem(input: {projectId: $project, contentId: $issue}) {
                projectNextItem {
                  id
                }
              }
            }' -f project=$PROJECT_ID -f issue="$ISSUE_ID" --jq '.data.addProjectNextItem.projectNextItem.id'
