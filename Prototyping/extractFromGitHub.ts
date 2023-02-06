import { OAuthApp, Octokit } from "octokit";
import dotenv from 'dotenv'
dotenv.config()

const clientId = process.env.GITHUB_CLIENT_ID || ""
const clientSecret = process.env.GITHUB_CLIENT_SECRET || ""

const app = new OAuthApp({
  clientId,
  clientSecret,
  defaultScopes: ["repo", "gist"]
});


async function main() {

    const username = "Eyon42"
    const repo = "UniSWBot"

    const octokit = await app.getUserOctokit({
        token: "ghu_yEGI49A0bkIAv4Ja8KI4dPhoNiZGlv4Is9du",
        scopes: ["repo", "read:user", "user:email"]
    })

    let res
    res = await octokit.request('GET /user', {})
    console.log(JSON.stringify(res.data,null,4))
    
    // for other users:
    // res = await octokit.request('GET /users/{username}', {
    //     username
    // })
    // res = await octokit.request('GET /user/emails', {})
    // console.log(JSON.stringify(res.data,null,4))

    // res = await octokit.request('GET /user/followers', {})
    // console.log(JSON.stringify(res.data.map(r=>r.login),null,4))

    res = await octokit.request('GET /users/{username}/repos', {
    username
    })

    console.log(JSON.stringify(res.data.map((r=>r.full_name)),null,4))
    
    // res = await octokit.graphql(`{
    //     user(login: "Eyon42") {
    //         contributionsCollection {
    //             commitContributionsByRepository {
        //                 url
    //             }
    //         }
    //     }
    // }`)
    // console.log(JSON.stringify(res, null, 4))

    // res = await octokit.request("/repos/{org_name}/{repo_name}/commits?sha={branchName}&page=0&per_page=30", {
    //     org_name: "Eyon42",
    //     repo_name: "UniSWBot",
    //     branchName: "4ff15c2b7b9572eb9f5811f48d4feb3d24eaa44f"
    // })

    // console.log(JSON.stringify(res, null, 4))
    // fs.writeFileSync(`data/${username}/${repo}/commit.json`,
    //     JSON.stringify(res, null, 4)
    // )
    // const commits = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        //     owner: username,
        //     repo: repo
        // })
        
    // fs.mkdirSync(`data/${username}/${repo}/`,
    //     {recursive: true})
    // fs.writeFileSync(`data/${username}/${repo}/commits.json`,
    //     JSON.stringify(commits, null, 4)
    // )
    
}

async function getOAuthScope(token: string) {
    const octokit = new Octokit({
        auth: token
    });
    const res = await octokit.request("GET /")
    const header = res?.headers["x-oauth-scopes"]
    return header ? header.split(/,\s*/) : []
}

if (process.argv.length === 2) {
    main()
}
else {
    switch (process.argv[2]){
        case "--tokenAuthScope":
            getOAuthScope(process.argv[3]).then(r=>console.log(r))
            break
        default:
            console.log("Incorrect Parameters")
            console.log(process.argv)
    }
}