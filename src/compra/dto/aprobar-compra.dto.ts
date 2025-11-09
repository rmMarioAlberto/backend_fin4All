import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TipoAprobacion {
  ENTREGA_DISTRIBUIDOR = 'entrega_distribuidor',
  PAGO_LOGISTICA = 'pago_logistica',
  PAGO_PRODUCTOR = 'pago_productor'
}

export class AprobarCompraDto {
  @ApiProperty({
    enum: TipoAprobacion,
    description: 'Tipo de aprobación: entrega_distribuidor (confirma recepción), pago_logistica (confirma pago recibido), pago_productor (confirma pago recibido)',
    example: 'entrega_distribuidor'
  })
  @IsNotEmpty()
  @IsEnum(TipoAprobacion)
  tipo_aprobacion: TipoAprobacion;
}