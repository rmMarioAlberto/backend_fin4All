import { Controller, Post, Body, UseGuards, Request, Get, HttpStatus, Param, ParseIntPipe, Put } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/compra.dto';
import { AprobarCompraDto } from './dto/aprobar-compra.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Compra')
@ApiBearerAuth()
@Controller('compra')
@UseGuards(AuthGuard, RolesGuard)
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Post()
  @Roles('distribuidor')
  @ApiOperation({ 
    summary: 'Crear una compra', 
    description: 'Crea una nueva compra. Solo disponible para usuarios con rol de distribuidor.'
  })
  @ApiBody({ 
    type: CreateCompraDto,
    description: 'Datos de la compra',
    examples: {
      'Compra sin logística': {
        value: {
          id_oferta_cultivo: 1,
          cantidad_cultivo: 10.0,
          precio_total: 15000.0
        },
        description: 'Compra solo del cultivo, sin servicio de logística'
      },
      'Compra con logística': {
        value: {
          id_oferta_cultivo: 1,
          id_oferta_logistica: 2,
          cantidad_cultivo: 10.0,
          precio_total: 15000.0
        },
        description: 'Compra incluyendo servicio de logística'
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Compra creada exitosamente',
    schema: {
      example: {
        id: 1,
        id_comprador: 5,
        id_oferta_cultivo: 1,
        id_oferta_logistica: 2,
        cantidad_cultivo: 10.0,
        precio_total: 15000.0,
        fecha_compra: '2025-11-09T12:00:00Z',
        estado: 'pendiente'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado o rol incorrecto' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos o cantidad no disponible' })
  async create(@Request() req, @Body() dto: CreateCompraDto) {
    return this.compraService.createCompra(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar todas las compras', 
    description: 'Obtiene un listado público de todas las compras realizadas'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de compras',
    schema: {
      example: [{
        id: 1,
        cantidad_cultivo: 10.0,
        precio_total: 15000.0,
        fecha_compra: '2025-11-09T12:00:00Z',
        estado: 'pendiente',
        usuario: {
          username: 'distribuidor1'
        },
        oferta_cultivo: {
          cantidad_disponible: 100.0,
          precio_tonelada: 1500.0,
          entidad_federativa: 'Yucatán',
          usuario: {
            username: 'productor1'
          }
        },
        oferta_logistica: {
          origen: 'Mérida, Yucatán',
          destino: 'CDMX',
          costo_total: 25000.0
        }
      }]
    }
  })
  async findAll() {
    return this.compraService.findAll();
  }

  @Get('mis-compras')
  @Roles('distribuidor')
  @ApiOperation({ 
    summary: 'Listar compras del distribuidor autenticado', 
    description: 'Obtiene el historial de compras del distribuidor que hace la petición'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de compras del distribuidor',
    schema: {
      example: [{
        id: 1,
        cantidad_cultivo: 10.0,
        precio_total: 15000.0,
        fecha_compra: '2025-11-09T12:00:00Z',
        estado: 'pendiente',
        oferta_cultivo: {
          cantidad_disponible: 100.0,
          precio_tonelada: 1500.0,
          entidad_federativa: 'Yucatán'
        },
        oferta_logistica: {
          origen: 'Mérida, Yucatán',
          destino: 'CDMX',
          costo_total: 25000.0
        }
      }]
    }
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado o rol incorrecto' })
  async findByUser(@Request() req) {
    return this.compraService.findByUser(req.user.id);
  }

  @Get('distribuidor/:id')
  @ApiOperation({ 
    summary: 'Listar compras de un distribuidor específico', 
    description: 'Obtiene el historial público de compras de un distribuidor específico'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del distribuidor',
    type: 'number',
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Listado de compras del distribuidor',
    schema: {
      example: [{
        id: 1,
        cantidad_cultivo: 10.0,
        precio_total: 15000.0,
        fecha_compra: '2025-11-09T12:00:00Z',
        estado: 'pendiente',
        usuario: {
          username: 'distribuidor1'
        },
        oferta_cultivo: {
          cantidad_disponible: 100.0,
          precio_tonelada: 1500.0,
          entidad_federativa: 'Yucatán'
        }
      }]
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Distribuidor no encontrado' })
  async findByDistribuidor(@Param('id', ParseIntPipe) id: number) {
    return this.compraService.findByUser(id);
  }

  @Get('oferta/:id')
  @ApiOperation({ summary: 'Listar compras de una oferta específica', description: 'Obtiene las compras realizadas sobre una oferta de cultivo específica' })
  @ApiParam({ name: 'id', description: 'ID de la oferta de cultivo', example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'Listado de compras sobre la oferta' })
  async findByOferta(@Param('id', ParseIntPipe) id: number) {
    return this.compraService.findByOferta(id);
  }

  @Get('productor/mis-ventas')
  @Roles('agricultor')
  @ApiOperation({ summary: 'Listar compras sobre las ofertas del productor autenticado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Listado de compras sobre las ofertas del productor' })
  async findByProductor(@Request() req) {
    return this.compraService.findByProductor(req.user.id);
  }

  @Put(':id/aprobar')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Aprobar una etapa de la compra',
    description: 'Permite a los diferentes roles (distribuidor, logística, productor) aprobar su parte del proceso de compra'
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la compra',
    type: 'number'
  })
  @ApiBody({
    type: AprobarCompraDto,
    description: 'Tipo de aprobación a realizar'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Aprobación realizada exitosamente',
    schema: {
      example: {
        id: 1,
        estado: 'entregado',
        aprobacion_distribuidor: true,
        aprobacion_logistica: false,
        aprobacion_productor: false,
        fecha_entrega: '2025-11-09T12:00:00Z'
      }
    }
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Compra no encontrada' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado para esta aprobación' })
  async aprobar(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: AprobarCompraDto
  ) {
    return this.compraService.aprobarCompra(id, req.user.id, dto.tipo_aprobacion);
  }
}
