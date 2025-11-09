import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCreditoDto, GetHistorialDto } from "./dto/creditos.dto";
import { PrismaServicePostgres } from "../prisma/prismaPosgres.service";

@Injectable()
export class CreditoService {

    constructor (
        private readonly prismaPostgres : PrismaServicePostgres
    ) {}

    async createSoliCredito (dto : CreateCreditoDto){
        const {id_usuario, monto, descripcion_credito} = dto

        const findUser = this.prismaPostgres.usuario.findUnique({where : {id : id_usuario}})

        if (!findUser) {
            throw new BadRequestException('El usuario no existe')
        }

        const newCredito = this.prismaPostgres.creditos.create({data : {
            id_usuario : id_usuario,
            monto : monto,
            descripcion_credito : descripcion_credito
        }})

        return newCredito

    }

    async getCreditos() {
        return this.prismaPostgres.creditos.findMany();
    }

    async getHistorialCompras(dto: GetHistorialDto) {
    const { id_usuario } = dto;

    const findUser = await this.prismaPostgres.usuario.findUnique({
      where: { id: id_usuario },
    });

    if (!findUser) {
      throw new BadRequestException('El usuario no existe');
    }

    const historial = await this.prismaPostgres.compra.findMany({
      where: { id_comprador: id_usuario,  },
      include: {
        usuario: true,  
        oferta_cultivo: true,  
        oferta_logistica: true
      },
      orderBy: { fecha_compra: 'desc' },  
    });

    return historial;
  }
}