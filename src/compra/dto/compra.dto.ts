import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompraDto {
  @ApiProperty({ example: 2, description: 'Id del comprador (se tomará del token normalmente)' })
  @IsNumber()
  @IsOptional()
  id_comprador?: number;

  @ApiProperty({ example: 1, description: 'Id de la oferta de cultivo que se compra' })
  @IsNumber()
  @IsNotEmpty()
  id_oferta_cultivo: number;

  @ApiProperty({ example: 1, description: 'Id de la oferta logística asociada (opcional)' })
  @IsNumber()
  @IsOptional()
  id_oferta_logistica?: number;

  @ApiProperty({ example: 10.0, description: 'Cantidad de cultivo a comprar (en toneladas)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  cantidad_cultivo: number;

  @ApiProperty({ example: 15000.0, description: 'Precio total de la compra (se puede calcular en backend)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precio_total: number;
}
