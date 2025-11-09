import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { OfertaCultivoService } from './oferta-cultivo.service';
import { CreateOfertaCultivoDto } from './dto/oferta-cultivo.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Oferta Cultivo')
@Controller('oferta-cultivo')
@UseGuards(AuthGuard, RolesGuard)
export class OfertaCultivoController {
  constructor(private readonly ofertaCultivoService: OfertaCultivoService) {}

  @Post()
  @Roles('agricultor')
  @ApiOperation({ summary: 'Crear una oferta de cultivo (agricultores)' })
  @ApiBody({
    schema: {
      example: {
        id_cultivo: 1,
        cantidad_disponible: 100.0,
        precio_tonelada: 1500.0,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Oferta creada',
    schema: {
      example: {
        id: 1,
        id_user: 2,
        id_cultivo: 1,
        cantidad_disponible: 100.0,
        precio_tonelada: 1500.0,
        fecha_publicacion: '2025-11-08T00:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
  })
  async createOfertaCultivo(
    @Request() req,
    @Body() createOfertaDto: CreateOfertaCultivoDto,
  ) {
    return this.ofertaCultivoService.createOfertaCultivo(
      req.user.id,
      createOfertaDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las ofertas de cultivos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de ofertas',
    schema: {
      example: [
        {
          id: 1,
          id_user: 2,
          id_cultivo: 1,
          cantidad_disponible: 100.0,
          precio_tonelada: 1500.0,
          fecha_publicacion: '2025-11-08T00:00:00Z',
          cultivo: { id: 1, nombre: 'Maíz' },
          usuario: { id: 2, username: 'agri1' },
        },
      ],
    },
  })
  async getOfertasCultivo() {
    return this.ofertaCultivoService.getOfertasCultivo();
  }

  @Get('mis-ofertas')
  @ApiOperation({ summary: 'Listar mis ofertas (usuario autenticado)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado de ofertas del usuario',
    schema: {
      example: [
        {
          id: 1,
          id_user: 2,
          id_cultivo: 1,
          cantidad_disponible: 100.0,
          precio_tonelada: 1500.0,
          fecha_publicacion: '2025-11-08T00:00:00Z',
          cultivo: { id: 1, nombre: 'Maíz' },
        },
      ],
    },
  })
  async getMisOfertas(@Request() req) {
    return this.ofertaCultivoService.getOfertasCultivoByUser(req.user.id);
  }
}
