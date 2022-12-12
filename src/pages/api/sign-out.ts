import { serialize } from 'cookie'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

const handler: NextApiHandler = async (request: NextApiRequest, response: NextApiResponse<any>) => {
  if (request.method !== 'POST') response.status(400).json({ error: 'invalid method' })
  if (!request.cookies?.authorization) return response.status(400).json({ error: 'no session' })
  response.setHeader('Set-Cookie', [
    serialize('authorization', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0
    })
  ])
  response.status(200).json({ error: null })
}

export default handler
