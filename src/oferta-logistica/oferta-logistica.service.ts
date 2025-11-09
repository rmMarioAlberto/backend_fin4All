import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaServicePostgres } from 'src/prisma/prismaPosgres.service';
import { CreateOfertaLogisticaDto } from './dto/oferta-logistica.dto';

@Injectable()
export class OfertaLogisticaService {
  constructor(private readonly prisma: PrismaServicePostgres) {}

  async createOfertaLogistica(userId: number, dto: CreateOfertaLogisticaDto) {
    // Verificar rol logistica (id_tipo_user = 2)
    const user = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!user || user.id_tipo_user !== 2) {
      throw new UnauthorizedException('Solo usuarios con rol logística pueden crear ofertas de logística');
    }

    return this.prisma.oferta_logistica.create({
      data: {
        id_user: userId,
        precio_tonelada: dto.precio_tonelada,
        ubicacion: dto.ubicacion,
        precio_km: dto.precio_km,
      },
    });
  }

  async findAll() {
    const ofertas = await this.prisma.oferta_logistica.findMany({ include: { usuario: { select: { username: true } } } });
    return ofertas;
  }

  async findByUser(userId: number) {
    return this.prisma.oferta_logistica.findMany({ where: { id_user: userId }, include: { usuario: { select: { username: true } } } });
  }
}
