import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { RegistroUsuarioDto, UploadDocsDto, ValidateUser } from "./dto/user.dto";
import { UserService } from "./user.service";
import { Roles } from "../auth/decorator/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthGuard } from "../auth/guards/auth.guard";

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

    @UseGuards(AuthGuard,RolesGuard)
    @Post('docsValidacion')
    @HttpCode(HttpStatus.CREATED)
    async uploadDocs(@Body() dto : UploadDocsDto){
        await this.userService.uploadDocs(dto);

        return {statusCode : HttpStatus.CREATED, message : "documentos cargados correctamente"}
    }

    @Roles('admin','auditor')
    @UseGuards(AuthGuard,RolesGuard)
    @Get('getUsersValidar')
    @HttpCode(HttpStatus.OK)
    async getUsersValidar(){
        const users = await this.userService.getUsersValidar();

        return {statusCode : HttpStatus.OK, message : 'usuarios reclectados', data : users}
    }

    @Roles('admin','auditor')
    @UseGuards(AuthGuard,RolesGuard)
    @Post('validarUser')
    @HttpCode(HttpStatus.OK)
    async validateUser (@Body() dto: ValidateUser){
        await this.userService.validateUser(dto);

        return {statusCode : HttpStatus.OK, message: 'Usuario actualizado correctamente'}
    }

}