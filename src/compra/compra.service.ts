import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaServicePostgres } from 'src/prisma/prismaPosgres.service';
import { CreateCompraDto } from './dto/compra.dto';
import { TipoAprobacion } from './dto/aprobar-compra.dto';

@Injectable()
export class CompraService {
  constructor(private readonly prisma: PrismaServicePostgres) {}

  async createCompra(userId: number, dto: CreateCompraDto) {
    // Verificar que el usuario es un distribuidor (id_tipo_user = 3)
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: { id_tipo_user: true }
    });
    
    if (!user || user.id_tipo_user !== 3) {
      throw new UnauthorizedException('Solo los distribuidores pueden realizar compras');
    }

    // Validar existencia de oferta_cultivo y cantidad disponible
    const oferta = await this.prisma.oferta_cultivo.findUnique({
      where: { id: dto.id_oferta_cultivo }
    });
    
    if (!oferta) {
      throw new NotFoundException('Oferta de cultivo no encontrada');
    }

    // Convertir a string para comparar cantidades decimales
    if (parseFloat(oferta.cantidad_disponible.toString()) < dto.cantidad_cultivo) {
      throw new UnauthorizedException('Cantidad solicitada no disponible');
    }

    // Si se provee oferta_logística, validar
    if (dto.id_oferta_logistica) {
      const ofertaLog = await this.prisma.oferta_logistica.findUnique({
        where: { id: dto.id_oferta_logistica }
      });
      if (!ofertaLog) {
        throw new NotFoundException('Oferta logística no encontrada');
      }
    }

    // Crear compra y actualizar cantidad disponible en la oferta de cultivo
    const compra = await this.prisma.$transaction(async (tx) => {
      // Crear la compra
      const nuevaCompra = await tx.compra.create({
        data: {
          id_comprador: userId,
          id_oferta_cultivo: dto.id_oferta_cultivo,
          id_oferta_logistica: dto.id_oferta_logistica ?? null,
          cantidad_cultivo: dto.cantidad_cultivo,
          precio_total: dto.precio_total,
        },
        include: {
          usuario: {
            select: { username: true }
          },
          oferta_cultivo: {
            include: {
              usuario: {
                select: { username: true }
              }
            }
          },
          oferta_logistica: true
        }
      });

      // Actualizar cantidad disponible
      await tx.oferta_cultivo.update({
        where: { id: dto.id_oferta_cultivo },
        data: {
          cantidad_disponible: {
            decrement: dto.cantidad_cultivo
          }
        }
      });

      return nuevaCompra;
    });

    return compra;
  }

  async findAll() {
    return this.prisma.compra.findMany({
      include: {
        usuario: {
          select: { username: true }
        },
        oferta_cultivo: {
          include: {
            usuario: {
              select: { username: true }
            }
          }
        },
        oferta_logistica: {
          select: {
            origen: true,
            destino: true,
            costo_total: true
          }
        }
      },
      orderBy: {
        fecha_compra: 'desc'
      }
    });
  }

  async findByOferta(ofertaId: number) {
    // validar existencia de la oferta
    const oferta = await this.prisma.oferta_cultivo.findUnique({ where: { id: ofertaId } });
    if (!oferta) throw new NotFoundException('Oferta de cultivo no encontrada');

    return this.prisma.compra.findMany({
      where: { id_oferta_cultivo: ofertaId },
      include: {
        usuario: { select: { username: true } },
        oferta_cultivo: { select: { id: true, cantidad_disponible: true, precio_tonelada: true, entidad_federativa: true } },
        oferta_logistica: { select: { origen: true, destino: true, costo_total: true } }
      },
      orderBy: { fecha_compra: 'desc' }
    });
  }

  async findByProductor(productorId: number) {
    // Obtener las ofertas del productor
    const ofertas = await this.prisma.oferta_cultivo.findMany({ where: { id_user: productorId }, select: { id: true } });
    const ids = ofertas.map(o => o.id);
    if (ids.length === 0) return [];

    return this.prisma.compra.findMany({
      where: { id_oferta_cultivo: { in: ids } },
      include: {
        usuario: { select: { username: true } },
        oferta_cultivo: { select: { id: true, cantidad_disponible: true, precio_tonelada: true, entidad_federativa: true } },
        oferta_logistica: { select: { origen: true, destino: true, costo_total: true } }
      },
      orderBy: { fecha_compra: 'desc' }
    });
  }

  async aprobarCompra(compraId: number, userId: number, tipoAprobacion: TipoAprobacion) {
    // Obtener la compra con todas sus relaciones
    const compra = await this.prisma.compra.findUnique({
      where: { id: compraId },
      select: {
        id: true,
        id_comprador: true,
        estado: true,
        aprobacion_distribuidor: true,
        aprobacion_logistica: true,
        aprobacion_productor: true,
        usuario: true,
        oferta_cultivo: {
          include: {
            usuario: true
          }
        },
        oferta_logistica: {
          include: {
            usuario: true
          }
        }
      }
    });

    if (!compra) {
      throw new NotFoundException('Compra no encontrada');
    }

    // Verificar permisos según el tipo de aprobación
    switch (tipoAprobacion) {
      case TipoAprobacion.ENTREGA_DISTRIBUIDOR:
        if (compra.id_comprador !== userId) {
          throw new UnauthorizedException('Solo el distribuidor puede confirmar la entrega');
        }
        if (compra.aprobacion_distribuidor) {
          throw new UnauthorizedException('La entrega ya fue confirmada');
        }
        break;

      case TipoAprobacion.PAGO_LOGISTICA:
        if (!compra.oferta_logistica || compra.oferta_logistica.usuario.id !== userId) {
          throw new UnauthorizedException('Solo el proveedor de logística puede confirmar su pago');
        }
        if (compra.aprobacion_logistica) {
          throw new UnauthorizedException('El pago de logística ya fue confirmado');
        }
        if (!compra.aprobacion_distribuidor) {
          throw new UnauthorizedException('El distribuidor debe confirmar la entrega primero');
        }
        break;

      case TipoAprobacion.PAGO_PRODUCTOR:
        if (compra.oferta_cultivo.usuario.id !== userId) {
          throw new UnauthorizedException('Solo el productor puede confirmar su pago');
        }
        if (compra.aprobacion_productor) {
          throw new UnauthorizedException('El pago al productor ya fue confirmado');
        }
        // Para compras con logística, verificar que se haya confirmado el pago de logística
        if (compra.oferta_logistica && !compra.aprobacion_logistica) {
          throw new UnauthorizedException('Se debe confirmar el pago de logística primero');
        }
        break;
    }

    // Actualizar los estados según el tipo de aprobación
    const updateData: any = {};
    const now = new Date();

    switch (tipoAprobacion) {
      case TipoAprobacion.ENTREGA_DISTRIBUIDOR:
        updateData.aprobacion_distribuidor = true;
        updateData.fecha_entrega = now;
        updateData.estado = 'entregado';
        break;

      case TipoAprobacion.PAGO_LOGISTICA:
        updateData.aprobacion_logistica = true;
        updateData.fecha_pago_logistica = now;
        updateData.estado = 'pago_logistica_confirmado';
        break;

      case TipoAprobacion.PAGO_PRODUCTOR:
        updateData.aprobacion_productor = true;
        updateData.fecha_pago_productor = now;
        updateData.estado = compra.oferta_logistica ? 'completado' : 'completado_sin_logistica';
        break;
    }

    // Actualizar la compra
    return this.prisma.compra.update({
      where: { id: compraId },
      data: updateData,
      include: {
        usuario: {
          select: { username: true }
        },
        oferta_cultivo: {
          include: {
            usuario: {
              select: { username: true }
            }
          }
        },
        oferta_logistica: {
          include: {
            usuario: {
              select: { username: true }
            }
          }
        }
      }
    });
  }

  async findByUser(userId: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.compra.findMany({
      where: { 
        id_comprador: userId
      },
      include: {
        oferta_cultivo: {
          include: {
            usuario: {
              select: { username: true }
            }
          }
        },
        oferta_logistica: {
          select: {
            origen: true,
            destino: true,
            costo_total: true
          }
        }
      },
      orderBy: {
        fecha_compra: 'desc'
      }
    });
  }
}
