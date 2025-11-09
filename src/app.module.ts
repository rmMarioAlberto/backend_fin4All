import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AccessModule } from "./access/access.module";
import { CorsMiddleware } from './utils/cors.middleware';
import { RateLimitMiddleware } from './utils/rate-limit.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    AccessModule,
    UserModule,
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
