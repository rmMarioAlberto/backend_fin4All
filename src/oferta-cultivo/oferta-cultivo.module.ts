import { Module } from '@nestjs/common';
import { OfertaCultivoController } from './oferta-cultivo.controller';
import { OfertaCultivoService } from './oferta-cultivo.service';
import { PrismaPostgresModule } from '../prisma/prismaPostgres.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
    imports: [PrismaPostgresModule, TokensModule],
    controllers: [OfertaCultivoController],
    providers: [OfertaCultivoService],
    exports: [OfertaCultivoService]
})
export class OfertaCultivoModule {}