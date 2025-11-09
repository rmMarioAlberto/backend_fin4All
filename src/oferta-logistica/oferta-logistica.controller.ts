import { Controller, Post, Body, UseGuards, Request, Get, HttpStatus } from '@nestjs/common';
import { OfertaLogisticaService } from './oferta-logistica.service';
import { CreateOfertaLogisticaDto } from './dto/oferta-logistica.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Oferta Logística')
@ApiBearerAuth()
@Controller('oferta-logistica')
@UseGuards(AuthGuard, RolesGuard)
export class OfertaLogisticaController {
  constructor(private readonly ofertaLogisticaService: OfertaLogisticaService) {}

  @Post()
  @Roles('logistica')
  @ApiOperation({ summary: 'Crear oferta logística (solo logistica)' })
  @ApiBody({ schema: { example: { id_servicio: 1, precio_tonelada: 1200.0, ubicacion: 'Ciudad X, Calle Y', precio_km: 2.5 } } })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Oferta logística creada' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado' })
  async create(@Request() req, @Body() dto: CreateOfertaLogisticaDto) {
    return this.ofertaLogisticaService.createOfertaLogistica(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ofertas logísticas' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de ofertas logísticas' })
  async findAll() {
    return this.ofertaLogisticaService.findAll();
  }

  @Get('mis-ofertas')
  @ApiOperation({ summary: 'Listar mis ofertas logísticas' })
  async findByUser(@Request() req) {
    return this.ofertaLogisticaService.findByUser(req.user.id);
  }
}
