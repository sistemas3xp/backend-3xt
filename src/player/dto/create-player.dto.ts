import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { Player } from '../entities/player.entity'

export class CreatePlayerDto extends Player {
  @ApiProperty({
    type: String,
    description: 'username'
  })
  @IsString()
  readonly username: string

  @ApiProperty({
    type: String,
    description: 'roomId'
  })
  @IsString()
  readonly roomId: string
}
