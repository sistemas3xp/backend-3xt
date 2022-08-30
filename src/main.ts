import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import actuator from 'express-actuator'
import { INestApplication, Logger, RequestMethod } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { DEFAULT_API_PREFIX } from './constants/default'
import { WinstonLogger } from './common/winston.logger'

import { TimeoutInterceptor } from './common/timeout.interceptor'
import { setCronJob } from './crons/count-conn-job'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PROJECT_NAME, PROJECT_DESCRIPTION, PROJECT_VERSION } from './constants'

const DEFAULT_API_VERSION = '1'
const DEFAULT_SWAGGER_PREFIX = '/docs'
const DEFAULT_API_PORT = 3000
const loggerInstance = new Logger('Bootstrap')
const options = {
  basePath: '/info'
}
//TODO FILTERS
//TODO CACHING SERVER

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(PROJECT_NAME)
    .setDescription(PROJECT_DESCRIPTION)
    .setVersion(PROJECT_VERSION)
    .build()

  const document = SwaggerModule.createDocument(app, options)
  const path = process.env.SWAGGER_PREFIX || DEFAULT_SWAGGER_PREFIX
  SwaggerModule.setup(path, app, document)
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'debug', 'log', 'warn', 'verbose'] })
  app.useLogger(app.get(WinstonLogger))
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  app.useGlobalInterceptors(new TimeoutInterceptor())
  app.enableCors()
  setupSwagger(app)
  app.use(actuator(options))
  app.setGlobalPrefix(`${process.env.PREFIX || DEFAULT_API_PREFIX}/v${DEFAULT_API_VERSION}`, {
    exclude: [{ path: 'metrics', method: RequestMethod.GET }]
  })
  await app.listen(process.env.API_PORT || DEFAULT_API_PORT)
  loggerInstance.log(`Application is running on: ${await app.getUrl()}${process.env.PREFIX || DEFAULT_API_PREFIX}`)
  await setCronJob(app)
}
bootstrap().catch((error) => loggerInstance.error(error))
