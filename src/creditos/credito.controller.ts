import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { CreateCreditoDto } from "./dto/creditos.dto";
import { CreditoService } from "./credito.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller('creditos')
@UseGuards(AuthGuard,RolesGuard)
export class CreditoController {

    constructor (
        private readonly creditoService : CreditoService
    ){}

    @Post('createCredito')
    @HttpCode(HttpStatus.CREATED)
    async createCredito (@Body() dto : CreateCreditoDto){
        const credito = await this.creditoService.createSoliCredito(dto)

        return {statusCode : HttpStatus.CREATED, message : 'Credito creado', data : credito}
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getCreditos (){
        const creditos = await this.creditoService.getCreditos();

        return {statusCode : HttpStatus.OK, message : 'Creditos obtenidos', data : creditos};
    }

}