import { Controller, Post, Body, UseGuards, Request, Get, HttpStatus } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/compra.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Compra')
@ApiBearerAuth()
@Controller('compra')
@UseGuards(AuthGuard)
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una compra (usuario autenticado)' })
  @ApiBody({ schema: { example: { id_oferta_cultivo: 1, id_oferta_logistica: 2, cantidad_cultivo: 10.0, precio_total: 15000.0 } } })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Compra creada' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  async create(@Request() req, @Body() dto: CreateCompraDto) {
    return this.compraService.createCompra(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar compras (admin o auditor quizás)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Listado de compras' })
  async findAll() {
    return this.compraService.findAll();
  }

  @Get('mis-compras')
  @ApiOperation({ summary: 'Listar mis compras (usuario autenticado)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Listado de compras del usuario' })
  async findByUser(@Request() req) {
    return this.compraService.findByUser(req.user.id);
  }
}
