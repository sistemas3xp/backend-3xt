import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common'
import { PlayerService } from './player.service'
import { CreatePlayerDto } from './dto/create-player.dto'
import { UpdatePlayerDto } from './dto/update-player.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a player' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'BadRequest' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Ok' })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto)
  }

  // @Get()
  // findAll() {
  //   return this.playerService.findAll()
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.playerService.findOne(id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
  //   return this.playerService.update(id, updatePlayerDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.playerService.remove(id)
  // }
}
