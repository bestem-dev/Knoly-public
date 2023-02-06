export const dateFormatter = new Intl.DateTimeFormat('es', {dateStyle:'full'})

export const capitalizeWord = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const capitalizeSentence = (s: string) => {
    const words = s.split(' ')
    return words.map(capitalizeWord).join(' ')
}

