import { OAuthApp, Octokit } from "octokit";
import prisma from "../src/prisma"
import fs from 'fs'
import os from 'os'
import dotenv from 'dotenv'
import UserDataQuery from './graphql/UserData';
import { saveDataAsJSON } from './helpers';
dotenv.config()

const clientId = process.env.GITHUB_CLIENT_ID || ""
const clientSecret = process.env.GITHUB_CLIENT_SECRET || ""

const app = new OAuthApp({
  clientId,
  clientSecret
});


async function main() {

    const accounts = await prisma.account.findMany({
        include: {
            user: true
        }
    })

    // Fetch all users in our db
    const appUsers: string[] = []
    await Promise.all(
        accounts.filter((a: any) => a.provider === "github").map(async (account: any) => {

            const octokit = await app.getUserOctokit({
                token: account.access_token!,
                scopes: ["repo", "read:user", "user:email"]
            })

            const user = (await octokit.request("GET /user")).data

            const res = await octokit.graphql(UserDataQuery, {
                user: user.login,
                id: user.node_id
            })
            const user_data = (res as any).user

            saveDataAsJSON(user_data, user.login, `data.json`)
            appUsers.push(user.login)
        })
    )
}

main()
