import { ConflictException, HttpStatus, Injectable } from "@nestjs/common";
import { RegistroUsuarioDto } from "./dto/user.dto";
import { PrismaServicePostgres } from "src/prisma/prismaPosgres.service";
import bcrypt from "bcrypt";

@Injectable()
export class UserService {

    constructor (
        private readonly prismaPostgress : PrismaServicePostgres
    ){}

    async userRegistro (dto : RegistroUsuarioDto){
        const {username,email, password, id_tipo_user} = dto

        const findEmail = await this.prismaPostgress.usuario.findUnique({where : {email : email}})

        if (findEmail)  {
            throw new ConflictException('El correo a registrar ya está ocupado');
        }

        const hashPassword  = await bcrypt.hash(password, 12);

        const newUser = await this.prismaPostgress.usuario.create({data : {username : username, email : email , password : hashPassword, id_tipo_user : id_tipo_user}})

        return newUser
    }
    
}