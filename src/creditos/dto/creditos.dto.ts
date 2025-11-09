import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCreditoDto {
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  monto: number;

  @IsNotEmpty()
  @IsString()
  descripcion_credito: string;
}

export class GetHistorialDto {
  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;
}
