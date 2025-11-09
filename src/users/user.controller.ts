import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { RegistroUsuarioDto, UploadDocsDto } from "./dto/user.dto";
import { UserService } from "./user.service";
import { Roles } from "src/auth/decorator/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AuthGuard } from "src/auth/guards/auth.guard";

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

    // @Roles('admin', 'auditor')
    // @UseGuards(AuthGuard,RolesGuard)
    // @Post('docsValidacion')
    // @HttpCode(HttpStatus.CREATED)
    // async uploadDocs(@Body() dto : UploadDocsDto){
    //     await this.userService.uploadDocs(dto);

    //     return {statusCode : HttpStatus.CREATED, message : "documentos cargados correctamente"}
    // }

}