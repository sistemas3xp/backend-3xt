import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { Player } from '../player/entities/player.entity'

@WebSocketGateway(8001)
export class TTTGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server
  private players: Player[] = []

  handleConnection(client: Socket, ...args: any[]) {
    let player = new Player()
    player.id = client.id
    player.roomId = '0'
    this.players.push(player)
    Logger.log(`Client connected: ${client.id}`)
    Logger.log(`Total players connected: ${this.players.length}`)
  }

  handleDisconnect = (client: Socket) => {
    Logger.log(`Client disconnected: ${client.id}`)
  }

  // TODO player events class
  // TODO room events class
  @SubscribeMessage('play')
  play(@MessageBody() data: string) {
    Logger.log(data)
  }
}
