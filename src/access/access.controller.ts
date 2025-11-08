import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AccessService } from './access.service';
import { AccessLoginDto } from './dto/access.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso y generación de tokens',
    schema: {
      example: {
        statusCode: 200,
        message: 'Login exitoso',
        data: {
          accessToken: 'jwt-access-token...',
          refreshToken: 'jwt-refresh-token...',
          user: {
            id: 1,
            username: 'usuarioEjemplo',
            email: 'correo@ejemplo.com',
            id_tipo_user: 2,
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() accessLoginDto: AccessLoginDto) {
    const result = await this.accessService.loginUser(accessLoginDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login exitoso',
      data: result,
    };
  }


  @Delete('logout')
  @ApiOperation({ summary: 'Cerrar sesión del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada correctamente',
    schema: {
      example: {
        statusCode: 200,
        message: 'Sesión cerrada correctamente',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o faltante' })
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta o es inválido el encabezado Authorization');
    }

    const refreshToken = authHeader.split(' ')[1];
    await this.accessService.logoutUser(refreshToken);

    return {
      statusCode: HttpStatus.OK,
      message: 'Sesión cerrada correctamente',
    };
  }

  
  @Get('refresh-token')
  @ApiOperation({ summary: 'Actualizar tokens (access y refresh)' })
  @ApiResponse({
    status: 200,
    description: 'Tokens renovados correctamente',
    schema: {
      example: {
        statusCode: 200,
        message: 'Tokens renovados correctamente',
        accessToken: 'nuevo-access-token...',
        refreshToken: 'nuevo-refresh-token...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta o es inválido el encabezado Authorization');
    }

    const refreshToken = authHeader.split(' ')[1];
    const newTokens = await this.accessService.refreshToken(refreshToken);

    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens renovados correctamente',
      tokens : newTokens,
    };
  }
}
