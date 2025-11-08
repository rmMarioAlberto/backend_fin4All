import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AccessModule } from "./access/access.module";
import { CorsMiddleware } from './utils/cors.middleware';
import { RateLimitMiddleware } from './utils/rate-limit.middleware';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AccessModule,
    ScheduleModule.forRoot()
  ],
})
export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        //CorsMiddleware, 
        //RateLimitMiddleware
      )
      .forRoutes('*'); 
  }

}
