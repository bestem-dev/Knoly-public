export function displayName(user: {firstName: string | null, lastName: string | null, [x: string | number | symbol]: unknown}) {
    return user.firstName + (user.lastName ? " " + user.lastName: "")
}