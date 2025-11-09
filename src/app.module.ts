import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AccessModule } from "./access/access.module";
import { CorsMiddleware } from './utils/cors.middleware';
import { RateLimitMiddleware } from './utils/rate-limit.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './users/user.module';
import { OfertaCultivoModule } from './oferta-cultivo/oferta-cultivo.module';
import { CultivoModule } from './cultivo/cultivo.module';
import { OfertaLogisticaModule } from './oferta-logistica/oferta-logistica.module';
import { CompraModule } from './compra/compra.module';
import { ChatModule } from './chat/chat.module';

import { AuditoriaModule } from './auditoria/auditoria.module';

@Module({
  imports: [
    AccessModule,
    UserModule,
    OfertaCultivoModule,
    CultivoModule,
    OfertaLogisticaModule,
    CompraModule,
<<<<<<< HEAD
    AuditoriaModule,
=======
    ChatModule,
>>>>>>> f5d1369cedbbb55a23b5808d7b34f7ceb0cd028b
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
