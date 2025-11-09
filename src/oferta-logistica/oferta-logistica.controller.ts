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
  @ApiOperation({ summary: 'Crear oferta logística', description: 'Crea una nueva oferta logística para una oferta de cultivo específica. Opcionalmente puede dirigirse a un distribuidor específico.' })
  @ApiBody({
    type: CreateOfertaLogisticaDto,
    description: 'Datos de la oferta logística',
    examples: {
      'Oferta general': {
        value: {
          id_oferta_cultivo: 1,
          origen: 'Mérida, Yucatán',
          destino: 'CDMX',
          distancia_km: 1250.5,
          costo_total: 25000.0
        },
        description: 'Ejemplo de oferta logística general'
      },
      'Oferta para distribuidor específico': {
        value: {
          id_oferta_cultivo: 1,
          id_distribuidor: 5,
          origen: 'Mérida, Yucatán',
          destino: 'CDMX',
          distancia_km: 1250.5,
          costo_total: 25000.0
        },
        description: 'Ejemplo de oferta logística dirigida a un distribuidor específico'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Oferta logística creada exitosamente',
    schema: {
      example: {
        id: 1,
        id_user: 2,
        id_oferta_cultivo: 1,
        id_distribuidor: null,
        origen: 'Mérida, Yucatán',
        destino: 'CDMX',
        distancia_km: 1250.5,
        costo_total: 25000.0,
        fecha_publicacion: '2025-11-09T12:00:00Z',
        estado: 'disponible'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado o rol incorrecto' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos o faltantes' })
  async create(@Request() req, @Body() dto: CreateOfertaLogisticaDto) {
    return this.ofertaLogisticaService.createOfertaLogistica(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las ofertas logísticas',
    description: 'Obtiene un listado de todas las ofertas logísticas disponibles con información de los usuarios relacionados'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de ofertas logísticas',
    schema: {
      example: [{
        id: 1,
        id_user: 2,
        id_oferta_cultivo: 1,
        id_distribuidor: null,
        origen: 'Mérida, Yucatán',
        destino: 'CDMX',
        distancia_km: 1250.5,
        costo_total: 25000.0,
        fecha_publicacion: '2025-11-09T12:00:00Z',
        estado: 'disponible',
        usuario: {
          username: 'empresa_logistica1'
        },
        distribuidor: null,
        oferta_cultivo: {
          id: 1,
          cantidad_disponible: 100.0,
          precio_tonelada: 5000.0,
          entidad_federativa: 'Yucatán',
          usuario: {
            username: 'productor1'
          }
        }
      }]
    }
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado' })
  async findAll() {
    return this.ofertaLogisticaService.findAll();
  }

  @Get('mis-ofertas')
  @ApiOperation({
    summary: 'Listar ofertas logísticas del usuario autenticado',
    description: 'Obtiene todas las ofertas logísticas creadas por el usuario actual'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de ofertas logísticas del usuario',
    schema: {
      example: [{
        id: 1,
        origen: 'Mérida, Yucatán',
        destino: 'CDMX',
        distancia_km: 1250.5,
        costo_total: 25000.0,
        fecha_publicacion: '2025-11-09T12:00:00Z',
        estado: 'disponible',
        oferta_cultivo: {
          id: 1,
          cantidad_disponible: 100.0,
          precio_tonelada: 5000.0,
          entidad_federativa: 'Yucatán',
          usuario: {
            username: 'productor1'
          }
        }
      }]
    }
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado' })
  async findByUser(@Request() req) {
    return this.ofertaLogisticaService.findByUser(req.user.id);
  }
}
