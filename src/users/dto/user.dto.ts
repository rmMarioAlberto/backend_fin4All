import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class RegistroUsuarioDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsNumber()  id_tipo_user: number;
}

class DocItemDto {
  @IsNotEmpty()
  @IsString()
  name: string; 

  @IsNotEmpty()
  @IsString()
  fileBase64: string; 
}

export class UploadDocsDto {
  @IsNotEmpty()
  @IsString()
  nameEmpresa: string;

  @IsNumber()
  @IsNotEmpty()
  idUsuario : number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocItemDto)
  docs: DocItemDto[];
}

export class ValidateUser{
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  idUser : number
}
