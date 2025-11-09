import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { RegistroUsuarioDto, UploadDocsDto } from './dto/user.dto';
import { PrismaServicePostgres } from 'src/prisma/prismaPosgres.service';
import bcrypt from 'bcrypt';
import { PrismaServiceMongo } from 'src/prisma/prismaMongo.service';
//import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaPostgress: PrismaServicePostgres,
    private readonly prismaMongo: PrismaServiceMongo,
  //  private readonly cloud: CloudinaryService,
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

  // async uploadDocs(dto: UploadDocsDto) {
  //   const { nameEmpresa, docs,idUsuario } = dto;

  //   const findUser = await this.prismaPostgress.usuario.findUnique({where : {id : idUsuario}})

  //   if (findUser?.status != 1) {
  //     throw new BadRequestException('El usuario ya esta validado')
  //   }

  //   const uploadResults = await Promise.all(
  //     docs.map(async (doc) => {
  //       const uploadRes = await this.cloud.uploadBase64(doc.fileBase64, {
  //         folder: `docs/${nameEmpresa}`,
  //         public_id: doc.name.replace(/\s+/g, '_'),
  //         resource_type: 'auto',
  //       });
  //       return {
  //         name: doc.name,
  //         cloudinary_id: uploadRes.public_id,
  //         url: uploadRes.secure_url,
  //       };
  //     }),
  //   );

  //   const documento = await this.prismaMongo.documentos.create({
  //     data: {
  //       id_usuario : idUsuario.toString(),
  //       nombreEmpresa: nameEmpresa,
  //       id_cloudinary: uploadResults,
  //     },
  //   });

  //   return {
  //     message: 'Documentos subidos y registrados correctamente',
  //     data: documento,
  //   };
  // }

}

