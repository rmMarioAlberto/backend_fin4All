import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddMessageDto, GetChat } from './dto/chat.dto';
import { PrismaServicePostgres } from '../prisma/prismaPosgres.service';
import { PrismaServiceMongo } from '../prisma/prismaMongo.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaPostgres: PrismaServicePostgres,
    private readonly prismaMongo: PrismaServiceMongo,
  ) {}

  async getChat(dto: GetChat) {
    const { idPublicacion, idUsuarioPropietario, idUsuarioCliente } = dto;

    let validatePublicacion: any =
      await this.prismaPostgres.oferta_cultivo.findUnique({
        where: { id: idPublicacion },
      });

    if (!validatePublicacion) {
      validatePublicacion =
        await this.prismaPostgres.oferta_logistica.findUnique({
          where: { id: idPublicacion },
        });
    }

    if (!validatePublicacion) {
      throw new NotFoundException(
        'No se encontró la publicación especificada.',
      );
    }

    const chat = await this.prismaMongo.chat.findFirst({
      where: {
        idPublicacion: idPublicacion.toString(),
        idUsuarioPropietario: idUsuarioPropietario.toString(),
        idUsuarioCliente: idUsuarioCliente.toString(),
      },
    });

    if (!chat) {
      return {
        message: 'No existe chat entre estos usuarios para esta publicación.',
      };
    }

    return chat;
  }

  async agregarMensaje(dto: AddMessageDto) {
    const {
      idPublicacion,
      idUsuarioPropietario,
      idUsuarioCliente,
      remitenteId,
      contenido,
    } = dto;

    // Verificar que exista la publicación (cultivo o logística)
    let validatePublicacion : any  =
      await this.prismaPostgres.oferta_cultivo.findUnique({
        where: { id: Number(idPublicacion) },
      });

    if (!validatePublicacion) {
      validatePublicacion =
        await this.prismaPostgres.oferta_logistica.findUnique({
          where: { id: Number(idPublicacion) },
        });
    }

    if (!validatePublicacion) {
      throw new BadRequestException('La publicación no existe');
    }

    // Buscar si el chat ya existe
    let chat = await this.prismaMongo.chat.findFirst({
      where: {
        idPublicacion: idPublicacion.toString(),
        idUsuarioPropietario: idUsuarioPropietario.toString(),
        idUsuarioCliente: idUsuarioCliente.toString(),
      },
    });

    const nuevoMensaje = {
      remitenteId: remitenteId.toString(),
      contenido,
      fechaEnvio: new Date().toISOString(),
    };

    if (chat) {
      // Si existe el chat, agregamos el nuevo mensaje
      const existingMensajes = Array.isArray(chat.mensajes) ? (chat.mensajes as any[]) : [];
      const mensajesActualizados = [...existingMensajes, nuevoMensaje];

      chat = await this.prismaMongo.chat.update({
        where: { id: chat.id },
        data: { mensajes: mensajesActualizados },
      });
    } else {
      // Si no existe el chat, lo creamos
      chat = await this.prismaMongo.chat.create({
        data: {
          idPublicacion: idPublicacion.toString(),
          idUsuarioPropietario: idUsuarioPropietario.toString(),
          idUsuarioCliente: idUsuarioCliente.toString(),
          mensajes: [nuevoMensaje],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    return {
      message: 'Mensaje agregado correctamente',
      data: chat,
    };
  }
}
