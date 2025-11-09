import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaServicePostgres } from 'src/prisma/prismaPosgres.service';
import { CreateCompraDto } from './dto/compra.dto';

@Injectable()
export class CompraService {
  constructor(private readonly prisma: PrismaServicePostgres) {}

  async createCompra(userId: number, dto: CreateCompraDto) {
    // validar existencia de oferta_cultivo
    const oferta = await this.prisma.oferta_cultivo.findUnique({ where: { id: dto.id_oferta_cultivo } });
    if (!oferta) throw new NotFoundException('Oferta de cultivo no encontrada');

    // si se provee oferta_logistica, validar
    if (dto.id_oferta_logistica) {
      const ofertaLog = await this.prisma.oferta_logistica.findUnique({ where: { id: dto.id_oferta_logistica } });
      if (!ofertaLog) throw new NotFoundException('Oferta logística no encontrada');
    }

    // crear compra
    const compra = await this.prisma.compra.create({
      data: {
        id_comprador: userId,
        id_oferta_cultivo: dto.id_oferta_cultivo,
        id_oferta_logistica: dto.id_oferta_logistica ?? null,
        cantidad_cultivo: dto.cantidad_cultivo,
        precio_total: dto.precio_total,
      },
    });

    return compra;
  }

  async findAll() {
    // devolver compras con comprador (solo username) y referencias a ofertas
  const compras = await this.prisma.compra.findMany({ include: { usuario: { select: { username: true } } } });
  return compras;
  }

  async findByUser(userId: number) {
  return this.prisma.compra.findMany({ where: { id_comprador: userId }, include: { usuario: { select: { username: true } } } });
  }
}
