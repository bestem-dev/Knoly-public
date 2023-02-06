import fs from 'fs'
import UserDataQuery from './graphql/UserData'
import { Octokit } from 'octokit'


export function saveDataAsJSON(data: any, folder: string, filename: string) {
    fs.mkdirSync(`data/${folder}`, {recursive: true})
    fs.writeFileSync(`data/${folder}/${filename}`,
        JSON.stringify(data, null, 4),
    )
}

export async function fetchUserData(octokit: Octokit, login?: string) {
    const user = (await octokit.request("GET /user")).data


    const user_data = (await octokit.graphql(UserDataQuery, {
        user: user.login,
        id: user.node_id
    }) as any).data.user
    
    return user_data
}