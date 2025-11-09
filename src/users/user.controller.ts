import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { RegistroUsuarioDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('usuario')
export class UserController {

    constructor (
        private readonly userService :UserService
    ){}
    
    @Post('registro')
    @HttpCode(HttpStatus.CREATED)
    async registroUser (@Body() dto : RegistroUsuarioDto) {
        await this.userService.userRegistro(dto)

        return {statusCode : HttpStatus.CREATED, message : 'Usuario creado correctamente'}
        
    }

}