import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaServicePostgres } from "src/prisma/prismaPosgres.service";
import { CreateOfertaCultivoDto } from './dto/oferta-cultivo.dto';

@Injectable()
export class OfertaCultivoService {
    constructor(private prisma: PrismaServicePostgres) {}

    async createOfertaCultivo(userId: number, createOfertaDto: CreateOfertaCultivoDto) {
        // Verificar que el usuario sea un agricultor (tipo_user = 1)
        const user = await this.prisma.usuario.findUnique({
            where: { id: userId },
            include: { tipo_user: true }
        });

        if (!user || user.id_tipo_user !== 1) {
            throw new UnauthorizedException('Solo los agricultores pueden crear ofertas de cultivos');
        }

        // Verificar que el cultivo exista
        const cultivo = await this.prisma.cultivo.findUnique({
            where: { id: createOfertaDto.id_cultivo }
        });

        if (!cultivo) {
            throw new UnauthorizedException('El cultivo especificado no existe');
        }

        return this.prisma.oferta_cultivo.create({
            data: {
                id_user: userId,
                id_cultivo: createOfertaDto.id_cultivo,
                cantidad_disponible: createOfertaDto.cantidad_disponible,
                precio_tonelada: createOfertaDto.precio_tonelada,
            }
        });
    }

    async getOfertasCultivo() {
        const ofertas = await this.prisma.oferta_cultivo.findMany({
            include: {
                usuario: { select: { username: true } }
            }
        });

        // Fetch all cultivos referenced by the ofertas in a single query to avoid N+1
        const cultivoIds = Array.from(new Set(ofertas.map(o => o.id_cultivo)));
        const cultivos = await this.prisma.cultivo.findMany({ where: { id: { in: cultivoIds } } });
        const cultivoMap = new Map(cultivos.map(c => [c.id, c]));

        // Attach cultivo data to each oferta (return plain objects)
        return ofertas.map(o => ({ ...o, cultivo: cultivoMap.get(o.id_cultivo) ?? null }));
    }

    async getOfertasCultivoByUser(userId: number) {
        const ofertas = await this.prisma.oferta_cultivo.findMany({
            where: { id_user: userId },
            include: { usuario: { select: { username: true } } }
        });

        const cultivoIds = Array.from(new Set(ofertas.map(o => o.id_cultivo)));
        const cultivos = await this.prisma.cultivo.findMany({ where: { id: { in: cultivoIds } } });
        const cultivoMap = new Map(cultivos.map(c => [c.id, c]));

        return ofertas.map(o => ({ ...o, cultivo: cultivoMap.get(o.id_cultivo) ?? null }));
    }
}