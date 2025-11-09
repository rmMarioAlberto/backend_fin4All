import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditoriaDto {
  @ApiProperty({ example: 1, description: 'ID del usuario auditado' })
  @IsInt()
  @IsNotEmpty()
  id_user: number;

  @ApiProperty({ example: 'agricultor', description: 'Tipo de auditoría (agricultor, distribuidor, logistica, etc.)' })
  @IsString()
  @IsNotEmpty()
  tipo_auditoria: string;

  @ApiProperty({ example: 'Todo correcto', description: 'Observaciones de la auditoría' })
  @IsString()
  observaciones?: string;
}
