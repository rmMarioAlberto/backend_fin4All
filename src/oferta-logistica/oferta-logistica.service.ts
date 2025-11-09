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

    // Verificar que la oferta de cultivo existe
    const ofertaCultivo = await this.prisma.oferta_cultivo.findUnique({
      where: { id: dto.id_oferta_cultivo }
    });
    if (!ofertaCultivo) {
      throw new UnauthorizedException('La oferta de cultivo especificada no existe');
    }

    // Si se especifica un distribuidor, verificar que existe y tiene el rol correcto
    if (dto.id_distribuidor) {
      const distribuidor = await this.prisma.usuario.findUnique({
        where: { id: dto.id_distribuidor }
      });
      if (!distribuidor || distribuidor.id_tipo_user !== 3) { // Asumiendo que 3 es el id para distribuidores
        throw new UnauthorizedException('El distribuidor especificado no existe o no tiene el rol correcto');
      }
    }

    return this.prisma.oferta_logistica.create({
      data: {
        id_user: userId,
        id_oferta_cultivo: dto.id_oferta_cultivo,
        id_distribuidor: dto.id_distribuidor,
        origen: dto.origen,
        destino: dto.destino,
        distancia_km: dto.distancia_km,
        costo_total: dto.costo_total,
      },
    });
  }

  async findAll() {
    const ofertas = await this.prisma.oferta_logistica.findMany({
      include: {
        usuario: { select: { username: true } },
        distribuidor: { select: { username: true } },
        oferta_cultivo: {
          include: {
            usuario: { select: { username: true } }
          }
        }
      }
    });
    return ofertas;
  }

  async findByUser(userId: number) {
    return this.prisma.oferta_logistica.findMany({
      where: { id_user: userId },
      include: {
        usuario: { select: { username: true } },
        distribuidor: { select: { username: true } },
        oferta_cultivo: {
          include: {
            usuario: { select: { username: true } }
          }
        }
      }
    });
  }
}
