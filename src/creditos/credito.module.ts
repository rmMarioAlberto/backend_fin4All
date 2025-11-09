import { Module } from '@nestjs/common';
import { CreditoController } from './credito.controller';
import { CreditoService } from './credito.service';
import { PrismaPostgresModule } from '../prisma/prismaPostgres.module';
import { AuthModule } from '../auth/auth.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  controllers: [CreditoController],
  providers: [CreditoService],
  imports: [PrismaPostgresModule, AuthModule, TokensModule],
})
export class CreditoModule {}
