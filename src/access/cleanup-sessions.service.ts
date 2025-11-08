// Archivo: src/sessions/cleanup-sessions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaServicePostgres } from '../prisma/prismaPosgres.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupSessionsService {
  constructor(private prismaPostgres: PrismaServicePostgres) {}

  @Cron(CronExpression.EVERY_HOUR) 
  async cleanExpiredSessions() {
    try {
      const now = new Date();

      const { count } = await this.prismaPostgres.sesion.deleteMany({
        where: {
          fecha_expiracion: { lte: now },
        },
      });

      console.log(`[CleanupSessionsService] Sesiones expiradas eliminadas: ${count}`);
    } catch (error) {
      console.error('[CleanupSessionsService] Error limpiando sesiones:', error);
    }
  }
}