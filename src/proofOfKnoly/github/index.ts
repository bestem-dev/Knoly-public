import fs from 'fs'
import _ from 'lodash'
import prisma from '@src/prisma'
import { OAuthApp } from "octokit";
import UserDataQuery from '@src/graphql/UserData';

const clientId = process.env.GITHUB_CLIENT_ID || ""
const clientSecret = process.env.GITHUB_CLIENT_SECRET || ""

const acceptedLanguagesMap: any = {
        "JavaScript": "JavaScript",
        "TypeScript": "TypeScript",
        "CSS": "CSS",
        "Dockerfile": "Docker",
        "Python": "Python",
        "Shell": "Shell",
        "Ruby": "Ruby",
        "HTML": "HTML",
        "Solidity": "Solidity"
    }

export async function createGitHubPoK(userId: string) {
    const {data, accountId} = await scrapeGitHubData(userId)
    // Feature extraction
    // const source = JSON.parse(fs.readFileSync("./data/Eyon42/data.json", {encoding: "utf-8"}))
    const repos = data.gql.contributionsCollection.commitContributionsByRepository.map((repo: any) => repo.repository)
    const repoNames = repos.map((r:any) => r.nameWithOwner)
    // const languages = Array.from(new Set(
    //     repos.map((r:any) => r.languages.edges.map((e:any) => e.node.name)).flat()
    // ))
    const commitsPerRepo = _.zipObject(repoNames, repos.map((r:any) => r.defaultBranchRef.target.history.edges.length))
    // const lineChangesPerRepo = _.zipObject(repoNames, repos.map((r:any) => r.defaultBranchRef.target.history.edges.reduce((prev:any,n:any) => prev + Math.max(n.node.deletions, n.node.additions),0)))
    
    const langScores: any = {}

    repos.forEach((r:any) => r.languages.edges.forEach((e:any) => {
        if (Object.keys(acceptedLanguagesMap).includes(e.node.name)) {
            const lang = acceptedLanguagesMap[e.node.name]
            const prevScore = langScores[lang] || 0
            const newScore = (commitsPerRepo[r.nameWithOwner] as number) * e.size / 1000
            langScores[lang] = prevScore + Math.log10(newScore)
        }
    }))
    // More feature ideas:
    // - Commit regularity (1/(std of diff(commit times)))
    // - Better use of changed files, additions and deletions
    // - Clone repos for deeper analysis
    // - Sort skill scores

    const pok = await prisma.proofOfKnoly.create({
        data: {
            content: {
                source: "github",
                skillScores: langScores
            },
            dataSources: {
                createMany: {
                    data: [{data}]
                }
            },
            accountId: accountId
        }
    })
    return pok
}

export async function scrapeGitHubData(userId: string) {
    const app = new OAuthApp({
        clientId,
        clientSecret
    });
    const userAccount = await prisma.account.findFirst({
        where: {
            userId: userId,
            provider: "github"
        }
    })
    
    const octokit = await app.getUserOctokit({
        token: userAccount!.access_token!,
        scopes: ["repo", "read:user", "user:email"]
    })

    const user = (await octokit.request("GET /user")).data

    const res = await octokit.graphql(UserDataQuery, {
        user: user.login,
        id: user.node_id
    })
    
    return {data: {gql: (res as any).user, rest:user}, accountId: userAccount!.id}
}