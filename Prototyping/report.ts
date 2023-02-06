import fs from 'fs'
import _ from 'lodash'

async function main() {
    // Feature extraction
    const source = JSON.parse(fs.readFileSync("./data/Eyon42/data.json", {encoding: "utf-8"}))
    const repos = source.contributionsCollection.commitContributionsByRepository.map((repo: any) => repo.repository)
    const repoNames = repos.map(r => r.nameWithOwner)
    const languages = Array.from(new Set(
        repos.map((r:any) => r.languages.edges.map((e:any) => e.node.name)).flat()
    ))
    const commitsPerRepo = _.zipObject(repoNames, repos.map(r => r.defaultBranchRef.target.history.edges.length))
    const lineChangesPerRepo = _.zipObject(repoNames, repos.map(r => r.defaultBranchRef.target.history.edges.reduce((prev,n) => prev + Math.max(n.node.deletions, n.node.additions),0)))
    
    const langScores: any = {}
    const acceptedLanguages: any = {
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

    repos.forEach(r => r.languages.edges.forEach(e => {
        if (Object.keys(acceptedLanguages).includes(e.node.name)) {
            const lang = acceptedLanguages[e.node.name]
            const prevScore = langScores[lang] || 0
            const newScore = (commitsPerRepo[r.nameWithOwner] as number) * e.size / 1000
            langScores[lang] = prevScore + Math.log10(newScore)
        }
    }))
    // More feature ideas:
    // - Commit regularity (1/(std of diff(commit times)))
    // - Better use of changed files, additions and deletions
    // - Clone repos for deeper analysis

    const analysis: any = {
        repos,
        languages,
        commitsPerRepo,
        lineChangesPerRepo,
        langScores
    }
    console.log(analysis)
}

main()