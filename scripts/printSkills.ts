import skills from './skills.json'


async function main() {
    skills.forEach((s) => {
        console.log(`${s.name}:${s.description}`)
    })
}

main()