import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfertaCultivoDto {
    @ApiProperty({ example: 1, description: 'Id del cultivo ofertado' })
    @IsNumber()
    @IsNotEmpty()
    id_cultivo: number;

    @ApiProperty({ example: 100.0, description: 'Cantidad disponible (en toneladas)' })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    cantidad_disponible: number;

    @ApiProperty({ example: 1500.0, description: 'Precio por tonelada' })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    precio_tonelada: number;
}