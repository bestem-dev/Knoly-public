import { Skill } from "@prisma/client"

export function validationIdsToNames(ids: {skillId: string}[], skills: Skill[]) {
    return ids.map((v)=> {
      const i = skills.findIndex((s)=>s.id===v.skillId)
      return skills[i].name
    })
}

export function validationIdsToSkills(ids: {skillId: string}[], skills: Skill[]) {
    return ids.map((v)=> {
      const i = skills.findIndex((s)=>s.id===v.skillId)
      return skills[i]
    })
}


export function validationNamesToIds(names: string[], skills: Skill[]) {
    return names.map((name)=> {
      const i = skills.findIndex((s)=>s.name===name)
      return skills[i].id
    })
}