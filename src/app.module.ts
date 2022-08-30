import { Module } from '@nestjs/common'
import { PromModule } from '@digikare/nestjs-prom'
import { LoggingModule } from './common/logging.module'
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { PlayerModule } from './player/player.module'

//IMPLEMENT RATE LIMIT
@Module({
  imports: [
    LoggingModule,
    EventEmitterModule.forRoot(),
    PromModule.forRoot({
      defaultLabels: {
        app: process.env.APP_NAME || 'bot-wpp',
        version: '0.0.1'
      },
      withHttpMiddleware: {
        enable: true
      }
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    PlayerModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
