import { Module } from '@nestjs/common';
import { OfertaLogisticaController } from './oferta-logistica.controller';
import { OfertaLogisticaService } from './oferta-logistica.service';
import { PrismaPostgresModule } from '../prisma/prismaPostgres.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [PrismaPostgresModule, TokensModule],
  controllers: [OfertaLogisticaController],
  providers: [OfertaLogisticaService],
  exports: [OfertaLogisticaService],
})
export class OfertaLogisticaModule {}
