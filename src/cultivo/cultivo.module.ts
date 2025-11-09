import { Module } from '@nestjs/common';
import { CultivoService } from './cultivo.service';
import { CultivoController } from './cultivo.controller';
import { PrismaPostgresModule } from '../prisma/prismaPostgres.module';

@Module({
  imports: [PrismaPostgresModule],
  providers: [CultivoService],
  controllers: [CultivoController],
  exports: [CultivoService],
})
export class CultivoModule {}
