import { Controller, Post, Body, Get, Param, HttpStatus } from '@nestjs/common';
import { CultivoService } from './cultivo.service';
import { CreateCultivoDto } from './dto/cultivo.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Cultivos')
@Controller('cultivo')
export class CultivoController {
  constructor(private readonly cultivoService: CultivoService) {}

  @Post()
  create(@Body() dto: CreateCultivoDto) {
    return this.cultivoService.create(dto);
  }

  @ApiOperation({ summary: 'Crear un nuevo cultivo' })
  @ApiBody({ schema: { example: { nombre: 'Maíz', descripcion: 'Maíz amarillo' } } })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Cultivo creado correctamente', schema: { example: { id: 1, nombre: 'Maíz', descripcion: 'Maíz amarillo' } } })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })

  @Get()
  @ApiOperation({ summary: 'Listar todos los cultivos' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista de cultivos', schema: { example: [{ id: 1, nombre: 'Maíz', descripcion: 'Maíz amarillo' }] } })
  findAll() {
    return this.cultivoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cultivo por id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Cultivo encontrado', schema: { example: { id: 1, nombre: 'Maíz', descripcion: 'Maíz amarillo' } } })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cultivo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.cultivoService.findOne(Number(id));
  }
}
