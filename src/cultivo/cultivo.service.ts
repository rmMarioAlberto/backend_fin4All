import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaServicePostgres } from 'src/prisma/prismaPosgres.service';
import { CreateCultivoDto } from './dto/cultivo.dto';

@Injectable()
export class CultivoService {
  constructor(private readonly prisma: PrismaServicePostgres) {}

  async create(dto: CreateCultivoDto) {
    return this.prisma.cultivo.create({ data: { nombre: dto.nombre, descripcion: dto.descripcion } });
  }

  async findAll() {
    return this.prisma.cultivo.findMany();
  }

  async findOne(id: number) {
    const cultivo = await this.prisma.cultivo.findUnique({ where: { id } });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');
    return cultivo;
  }
}
