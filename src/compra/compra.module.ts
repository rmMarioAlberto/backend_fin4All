import { Module } from '@nestjs/common';
import { CompraController } from './compra.controller';
import { CompraService } from './compra.service';
import { PrismaPostgresModule } from '../prisma/prismaPostgres.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [PrismaPostgresModule, TokensModule],
  controllers: [CompraController],
  providers: [CompraService],
  exports: [CompraService],
})
export class CompraModule {}
