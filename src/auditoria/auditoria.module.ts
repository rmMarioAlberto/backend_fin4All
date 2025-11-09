import { Module } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaController } from './auditoria.controller';
import { PrismaServicePostgres } from '../prisma/prismaPosgres.service';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TokensModule],
  providers: [AuditoriaService, PrismaServicePostgres],
  controllers: [AuditoriaController],
})
export class AuditoriaModule {}
