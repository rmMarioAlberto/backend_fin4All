import { Controller, Post, Body, UseGuards, Request, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Auditoría')
@ApiBearerAuth()
@Controller('auditoria')
@UseGuards(AuthGuard, RolesGuard)
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Post()
  @Roles('auditor')
  @ApiOperation({ summary: 'Registrar auditoría (solo auditores)' })
  @ApiBody({ type: CreateAuditoriaDto })
  @ApiResponse({ status: 201, description: 'Auditoría registrada' })
  async crear(@Request() req, @Body() dto: CreateAuditoriaDto) {
    return this.auditoriaService.crearAuditoria(req.user.id, dto);
  }

  @Get('ultima/:id')
  @ApiOperation({ summary: 'Obtener última auditoría de un usuario' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario auditado' })
  @ApiResponse({ status: 200, description: 'Última auditoría encontrada' })
  @ApiResponse({ status: 404, description: 'No se encontró auditoría para el usuario' })
  async obtenerUltima(@Param('id', ParseIntPipe) id: number) {
    return this.auditoriaService.obtenerUltimaAuditoria(id);
  }
}
