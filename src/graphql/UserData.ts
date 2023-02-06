const UserDataQuery = `
query UserData($user: String!, $id: ID!) {
  user(login: $user) {
    contributionsCollection {
      commitContributionsByRepository {
        repository {
          nameWithOwner
          defaultBranchRef {
            target {
              ... on Commit {
                history(author: {id: $id}) {
                  edges {
                    node {
                      message
                      changedFilesIfAvailable
                      deletions
                      additions
                      committedDate
                      id
                      oid
                      zipballUrl
                      parents(last: 1) {
                        nodes {
                          oid
                          zipballUrl
                        }
                      }
                      tree {
                        id
                      }
                      author {
                        date
                        email
                        name
                      }
                    }
                  }
                }
              }
            }
          }
          languages(first: 100) {
            totalCount
            edges {
              size
              node {
                name
              }
            }
          }
        }
      }
    }
    bio
    avatarUrl
    company
    email
    isBountyHunter
    isCampusExpert
    isDeveloperProgramMember
    isEmployee
    isFollowingViewer
    isGitHubStar
    isHireable
    isSiteAdmin
    isSponsoringViewer
    isViewer
    location
    monthlyEstimatedSponsorsIncomeInCents
    name
    twitterUsername
    updatedAt
    websiteUrl
    followers(first: 100) {
      totalCount
      edges {
        node {
          email
          login
        }
      }
    }
    following(first: 100) {
      totalCount
      edges {
        node {
          email
          login
        }
      }
    }
  }
}
`

export default UserDataQuery