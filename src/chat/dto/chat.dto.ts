import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class ChatDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  idPublicacion: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  idUsuarioPropietario: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  idUsuarioCliente: number;
}

export class GetChat {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  idPublicacion: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  idUsuarioPropietario: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  idUsuarioCliente: number;
}

export class AddMessageDto {
  @ApiProperty({ example: 'pub123' })
  @IsNotEmpty()
  @IsString()
  idPublicacion: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsString()
  idUsuarioPropietario: string;

  @ApiProperty({ example: '2' })
  @IsNotEmpty()
  @IsString()
  idUsuarioCliente: string;

  @ApiProperty({
    example: '1',
    description: 'ID del remitente (quien envía el mensaje)',
  })
  @IsNotEmpty()
  @IsString()
  remitenteId: string;

  @ApiProperty({ example: 'Hola, ¿sigues vendiendo?' })
  @IsNotEmpty()
  @IsString()
  contenido: string;
}
