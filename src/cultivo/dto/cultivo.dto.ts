import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCultivoDto {
    @ApiProperty({ example: 'Maíz', description: 'Nombre del cultivo' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: 'Maíz amarillo de grano', description: 'Descripción del cultivo', required: false })
    @IsString()
    @IsOptional()
    descripcion?: string;
}
