import { IsNotEmpty, IsNumber, Min, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOfertaLogisticaDto {
  @ApiProperty({ example: 1, description: 'ID de la oferta de cultivo a la que se hace la oferta logística' })
  @IsNumber()
  @IsNotEmpty()
  id_oferta_cultivo: number;

  @ApiPropertyOptional({ example: 1, description: 'ID del distribuidor al que va dirigida la oferta (opcional)' })
  @IsNumber()
  @IsOptional()
  id_distribuidor?: number;

  @ApiProperty({ example: 'Mérida, Yucatán', description: 'Ubicación de origen del transporte' })
  @IsString()
  @IsNotEmpty()
  origen: string;

  @ApiProperty({ example: 'CDMX', description: 'Ubicación de destino del transporte' })
  @IsString()
  @IsNotEmpty()
  destino: string;

  @ApiProperty({ example: 1250.5, description: 'Distancia en kilómetros del recorrido' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  distancia_km: number;

  @ApiProperty({ example: 25000.0, description: 'Costo total del servicio de transporte' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  costo_total: number;
}
