import { Injectable } from '@nestjs/common';
import { PrismaServicePostgres } from '../prisma/prismaPosgres.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';

@Injectable()
export class AuditoriaService {
  constructor(private readonly prisma: PrismaServicePostgres) {}

  async crearAuditoria(auditorId: number, dto: CreateAuditoriaDto) {
    // Se asume que el auditorId es el usuario que realiza la auditoría
    return this.prisma.auditoria.create({
      data: {
        id_user: dto.id_user,
        tipo_auditoria: dto.tipo_auditoria,
        observaciones: dto.observaciones,
      },
    });
  }

  async obtenerUltimaAuditoria(id_user: number) {
    return this.prisma.auditoria.findFirst({
      where: { id_user },
      orderBy: { fecha_auditoria: 'desc' },
    });
  }
}
