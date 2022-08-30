import { Prisma } from '@prisma/client'

export class Player {
  id?: string | undefined
  username: string
  roomId: string
}
