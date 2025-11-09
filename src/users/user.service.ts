import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  RegistroUsuarioDto,
  UploadDocsDto,
  ValidateUser,
} from './dto/user.dto';
import { PrismaServicePostgres } from '../prisma/prismaPosgres.service';
import bcrypt from 'bcrypt';
import { PrismaServiceMongo } from '../prisma/prismaMongo.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaPostgress: PrismaServicePostgres,
    private readonly prismaMongo: PrismaServiceMongo,
    private readonly cloud: CloudinaryService,
  ) {}

  async userRegistro(dto: RegistroUsuarioDto) {
    const { username, email, password, id_tipo_user } = dto;

    const findEmail = await this.prismaPostgress.usuario.findUnique({
      where: { email: email },
    });

    if (findEmail) {
      throw new ConflictException('El correo a registrar ya está ocupado');
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await this.prismaPostgress.usuario.create({
      data: {
        username: username,
        email: email,
        password: hashPassword,
        id_tipo_user: id_tipo_user,
      },
    });

    return newUser;
  }

  async uploadDocs(dto: UploadDocsDto) {
    const { nameEmpresa, docs, idUsuario } = dto;

    // Buscar usuario
    const findUser = await this.prismaPostgress.usuario.findUnique({
      where: { id: idUsuario },
    });

    // Si el usuario no existe
    if (!findUser) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Validar que el usuario esté en estado "sin validar" (status = 1)
    if (findUser.status !== 1) {
      throw new ForbiddenException(
        'El usuario no está habilitado para subir documentos',
      );
    }

    const hasDocs = await this.prismaMongo.documentos.findFirst({
      where: { id_usuario: idUsuario.toString() },
    });

    if (hasDocs) {
      throw new ConflictException('El usuario ya tiene docs cargados')
    }

    try {
      if (!docs || docs.length === 0) {
        throw new BadRequestException(
          'No se proporcionaron documentos para subir',
        );
      }

      const uploadResults: {
        name: string;
        cloudinary_id: string;
        url: string;
      }[] = [];

      for (const doc of docs) {
        if (!doc.fileBase64) {
          throw new BadRequestException(
            `El documento "${doc.name}" no tiene contenido`,
          );
        }

        // Extraer base64 puro y detectar extensión
        let base64Pure = doc.fileBase64;
        let fileName = doc.name;

        const base64Match = doc.fileBase64.match(/^data:([^;]+);base64,(.+)$/);
        if (base64Match) {
          const mimeType = base64Match[1];
          base64Pure = base64Match[2];

          if (!fileName.includes('.')) {
            if (mimeType === 'application/pdf') {
              fileName += '.pdf';
            } else if (mimeType.startsWith('image/')) {
              fileName += `.${mimeType.split('/')[1]}`;
            }
          }
        }

        // Subir a Cloudinary
        const uploadRes = await this.cloud.uploadBase64(
          base64Pure,
          {
            folder: `docs/${nameEmpresa}`,
            public_id: doc.name.replace(/\s+/g, '_'),
            resource_type: 'raw',
            format: 'pdf',
          },
          fileName,
        );

        uploadResults.push({
          name: doc.name,
          cloudinary_id: uploadRes.public_id,
          url: uploadRes.secure_url.replace('/upload/', '/upload/fl_inline/'), // 👈 opcional para abrir inline
        });
      }

      // Guardar en MongoDB
      const documento = await this.prismaMongo.documentos.create({
        data: {
          id_usuario: idUsuario.toString(),
          nombreEmpresa: nameEmpresa,
          id_cloudinary: uploadResults,
          createdAt : new Date()
        },
      });

      return {
        message: 'Documentos subidos y registrados correctamente',
        data: documento,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Error al procesar los documentos: ${error.message}`,
      );
    }
  }

  async getUsersValidar() {
    const usuarios = await this.prismaPostgress.usuario.findMany({
      where: { status: 1 },
      select: { id: true, username: true, email: true },
    });

    console.log(usuarios);

    if (usuarios.length === 0) {
      return { message: 'No hay usuarios pendientes de validar', data: [] };
    }

    const usuariosConDocs = await Promise.all(
      usuarios.map(async (user) => {
        const docs = await this.prismaMongo.documentos.findFirst({
          where: { id_usuario: user.id.toString() },
        });

        return {
          ...user,
          documentos: docs || null,
        };
      }),
    );

    return {
      message: 'Usuarios pendientes de validar recuperados correctamente',
      data: usuariosConDocs,
    };
  }

  async validateUser (dto : ValidateUser){
    const {idUser} = dto

    const findUser = this.prismaPostgress.usuario.findUnique({where : {id : idUser}})

    if (!findUser) {
      throw new BadRequestException('El usuario no existe')
    }

    await this.prismaPostgress.usuario.update({where : {id : idUser}, data : {status : 2}})//user validado

    return true;
  }
}
