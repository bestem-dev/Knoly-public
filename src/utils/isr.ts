import { NextApiResponse } from "next";

export async function revalidateUserPages(res: NextApiResponse, id: string) {
  await res.revalidate("/users/" + id)
}