import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfertaLogisticaDto {
  @ApiProperty({ example: 1, description: 'Id del servicio/logística (referencia a un tipo de servicio si aplica)' })
  @IsNumber()
  @IsNotEmpty()
  id_servicio: number;

  @ApiProperty({ example: 1200.0, description: 'Precio por tonelada ofrecido por la logística' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precio_tonelada: number;

  @ApiProperty({ example: 'Ciudad de destino, Calle 123', description: 'Ubicación o descripción del punto de recolección/entrega' })
  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  @ApiProperty({ example: 2.5, description: 'Precio por kilómetro' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precio_km: number;
}
