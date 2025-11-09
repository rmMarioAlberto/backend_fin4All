# README - backend_fin4All

## Descripción General

**backend_fin4All** es una plataforma de marketplace agrícola construida con NestJS que conecta a productores, proveedores logísticos y distribuidores para facilitar transacciones de cultivos con transparencia y trazabilidad completa. [1](#0-0) 

## Arquitectura del Sistema

### Stack Tecnológico

- **Framework**: NestJS con TypeScript [2](#0-1) 
- **Bases de Datos**: 
  - PostgreSQL (datos transaccionales) [3](#0-2) 
  - MongoDB (documentos y chat)<cite />
- **ORM**: Prisma Client<cite />
- **Autenticación**: JWT con bcrypt [4](#0-3) 
- **Almacenamiento**: Cloudinary para archivos [5](#0-4) 

### Módulos Principales

```
AppModule
├── AccessModule (autenticación JWT)
├── UserModule (gestión de usuarios)
├── CultivoModule (tipos de cultivos)
├── OfertaCultivoModule (ofertas de productores)
├── OfertaLogisticaModule (ofertas de transporte)
├── CompraModule (transacciones)
├── ChatModule (mensajería)
├── CreditoModule (créditos financieros)
└── AuditoriaModule (logs de auditoría)
``` [6](#0-5) 

## Roles de Usuario

El sistema implementa 5 roles con permisos específicos: [7](#0-6) 

| ID | Rol | Capacidades |
|----|-----|-------------|
| 1 | `agricultor` | Crear ofertas de cultivo, aprobar entregas [8](#0-7)  |
| 2 | `logistica` | Crear ofertas de transporte, aprobar envíos [9](#0-8)  |
| 3 | `distribuidor` | Iniciar compras, confirmar recepciones [10](#0-9)  |
| 4 | `admin` | Validar usuarios, gestión del sistema [11](#0-10)  |
| 5 | `auditor` | Revisar auditorías, validar usuarios [12](#0-11)  |

## Flujo de Transacciones

### 1. Creación de Oferta de Cultivo
El productor crea una oferta con cantidad disponible y precio por tonelada. [13](#0-12) 

### 2. Oferta Logística (Opcional)
El proveedor logístico crea una cotización de transporte vinculada a la oferta de cultivo. [14](#0-13) 

### 3. Compra
El distribuidor inicia la compra, que puede incluir o no servicio logístico. [15](#0-14) 

### 4. Aprobación Tripartita
La transacción requiere aprobación de las tres partes:
- `aprobacion_distribuidor`: Confirma recepción [16](#0-15) 
- `aprobacion_logistica`: Confirma entrega [17](#0-16) 
- `aprobacion_productor`: Confirma pago [18](#0-17) 

### 5. Estados de Compra
- `pendiente` → `entregado` → `completado` [19](#0-18) 

## Modelo de Datos Principal

### Usuario
```typescript
{
  id: number
  email: string (único)
  password: string (bcrypt)
  id_tipo_user: number (1-5)
  status: number (1=pendiente, 2=validado)
  username: string
}
``` [20](#0-19) 

### Oferta de Cultivo
```typescript
{
  id: number
  id_user: number
  id_cultivo: number
  cantidad_disponible: Decimal
  precio_tonelada: Decimal
  entidad_federativa: string
}
``` [21](#0-20) 

### Compra
```typescript
{
  id: number
  id_comprador: number
  id_oferta_cultivo: number
  id_oferta_logistica?: number
  cantidad_cultivo: Decimal
  precio_total: Decimal
  estado: string
  aprobacion_distribuidor: boolean
  aprobacion_logistica?: boolean
  aprobacion_productor: boolean
}
``` [22](#0-21) 

## Servicios de Soporte

### Chat
Sistema de mensajería basado en publicaciones que conecta clientes con propietarios de ofertas. Usa MongoDB para almacenar conversaciones con mensajes embebidos. [23](#0-22) 

### Créditos
Gestión de solicitudes de crédito financiero con seguimiento de historial de compras. [24](#0-23) 

### Cloudinary
Servicio de almacenamiento de archivos que soporta imágenes y PDFs con detección automática de MIME type. [25](#0-24) 

## Seguridad

- **Contraseñas**: Hash bcrypt con 12 salt rounds [4](#0-3) 
- **Autenticación**: JWT tokens almacenados en tabla `sesion` [26](#0-25) 
- **Autorización**: Guards basados en roles (`AuthGuard` + `RolesGuard`) [27](#0-26) 
- **Validación de Usuarios**: Proceso de dos pasos (registro → aprobación admin) [28](#0-27) 

## Instalación y Configuración

### Variables de Entorno Requeridas
```env
DATABASE_URL_POSTGRE=postgresql://...
DATABASE_URL_MONGO=mongodb://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
<cite />

### Comandos Básicos
```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Iniciar servidor
npm run start:dev
```
<cite />

## Endpoints Principales

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/usuario/registro` | - | Registro de usuario<cite /> |
| POST | `/auth/login` | - | Autenticación<cite /> |
| POST | `/oferta-cultivo` | agricultor | Crear oferta de cultivo<cite /> |
| POST | `/oferta-logistica` | logistica | Crear oferta logística [29](#0-28)  |
| POST | `/compra` | distribuidor | Iniciar compra [30](#0-29)  |
| GET | `/compra/mis-compras` | distribuidor | Historial de compras [31](#0-30)  |
| POST | `/creditos/createCredito` | - | Solicitar crédito [32](#0-31)  |

## Características Clave

1. **Persistencia Políglota**: PostgreSQL para transacciones + MongoDB para documentos flexibles<cite />
2. **Workflow Multi-Parte**: Aprobaciones tripartitas para transparencia<cite />
3. **Trazabilidad Completa**: Auditoría de todas las acciones del sistema<cite />
4. **Validación de Usuarios**: Proceso de verificación con documentos antes de acceso completo<cite />
5. **Integridad Referencial**: Cascadas de eliminación para mantener consistencia [33](#0-32) 

## Notes

Este README cubre los aspectos más relevantes del sistema backend_fin4All. Para detalles específicos sobre cada módulo, consulta la documentación wiki del proyecto. El sistema está diseñado para garantizar transparencia en transacciones agrícolas mediante un flujo de aprobaciones multi-parte y trazabilidad completa de todas las operaciones.<cite />

Wiki pages you might want to explore:
- [Overview (rmMarioAlberto/backend_fin4All)](/wiki/rmMarioAlberto/backend_fin4All#1)
- [Supporting Services (rmMarioAlberto/backend_fin4All)](/wiki/rmMarioAlberto/backend_fin4All#5)
- [Credit Management (rmMarioAlberto/backend_fin4All)](/wiki/rmMarioAlberto/backend_fin4All#5.2)

### Citations

**File:** src/app.module.ts (L1-14)
```typescript
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AccessModule } from "./access/access.module";
import { CorsMiddleware } from './utils/cors.middleware';
import { RateLimitMiddleware } from './utils/rate-limit.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './users/user.module';
import { OfertaCultivoModule } from './oferta-cultivo/oferta-cultivo.module';
import { CultivoModule } from './cultivo/cultivo.module';
import { OfertaLogisticaModule } from './oferta-logistica/oferta-logistica.module';
import { CompraModule } from './compra/compra.module';
import { ChatModule } from './chat/chat.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { CreditoModule } from './creditos/credito.module';

```

**File:** src/app.module.ts (L15-27)
```typescript
@Module({
  imports: [
    AccessModule,
    UserModule,
    OfertaCultivoModule,
    CultivoModule,
    OfertaLogisticaModule,
    CompraModule,
    AuditoriaModule,
    CreditoModule,
    ScheduleModule.forRoot()
  ],
})
```

**File:** prisma/schemaPostgres.prisma (L7-10)
```text
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL_POSTGRE")
}
```

**File:** prisma/schemaPostgres.prisma (L12-20)
```text
model sesion {
  id_sesion        Int       @id @default(autoincrement())
  id_usuario       Int
  token_acceso     String
  token_refresh    String
  fecha_creacion   DateTime? @default(now()) @db.Timestamp(6)
  fecha_expiracion DateTime  @db.Timestamp(6)
  usuario          usuario   @relation(fields: [id_usuario], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_usuario")
}
```

**File:** prisma/schemaPostgres.prisma (L22-27)
```text
model tipo_user {
  id          Int       @id @default(autoincrement())
  nombre      String    @db.VarChar(100)
  descripcion String?
  usuario     usuario[]
}
```

**File:** prisma/schemaPostgres.prisma (L29-36)
```text
model usuario {
  id                   Int                @id @default(autoincrement())
  email                String             @unique @db.VarChar(100)
  password             String             @db.VarChar(255)
  id_tipo_user         Int
  status               Int                @default(1)
  created_at           DateTime?          @default(now()) @db.Timestamp(6)
  username             String             @db.VarChar(50)
```

**File:** prisma/schemaPostgres.prisma (L47-54)
```text
model oferta_cultivo {
  id                  Int                @id @default(autoincrement())
  id_user             Int
  id_cultivo          Int
  cantidad_disponible Decimal            @db.Decimal(10, 2)
  precio_tonelada     Decimal            @db.Decimal(10, 2)
  fecha_publicacion   DateTime?          @default(now()) @db.Timestamp(6)
  entidad_federativa  String             @default("N/D") @db.VarChar(100)
```

**File:** prisma/schemaPostgres.prisma (L66-77)
```text
model compra {
  id                       Int               @id @default(autoincrement())
  id_comprador             Int
  id_oferta_cultivo        Int
  id_oferta_logistica      Int?
  cantidad_cultivo         Decimal           @db.Decimal(10, 2)
  precio_total             Decimal           @db.Decimal(10, 2)
  fecha_compra             DateTime?         @default(now()) @db.Timestamp(6)
  estado                   String            @default("pendiente") @db.VarChar(50)
  aprobacion_distribuidor  Boolean           @default(false)
  aprobacion_logistica     Boolean?
  aprobacion_productor     Boolean           @default(false)
```

**File:** src/users/user.service.ts (L36-36)
```typescript
    const hashPassword = await bcrypt.hash(password, 12);
```

**File:** src/users/user.service.ts (L64-68)
```typescript
    if (findUser.status !== 1) {
      throw new ForbiddenException(
        'El usuario no está habilitado para subir documentos',
      );
    }
```

**File:** src/cloudinary/cloudinary.service.ts (L19-21)
```typescript
  async upload(file: any) {
    return await this.v2.uploader.upload(file);
  }
```

**File:** src/cloudinary/cloudinary.service.ts (L23-55)
```typescript
  async uploadBase64(base64: string, options: any = {}, fileName?: string) {
    try {
      // Detectar mime por extensión si se proporcionó fileName
      let mimeType = 'application/octet-stream';
      if (fileName) {
        const ext = path.extname(fileName).toLowerCase();
        if (ext === '.pdf') mimeType = 'application/pdf';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        else if (ext === '.png') mimeType = 'image/png';
      }

      // Si options ya trae resource_type no lo pisamos; si no, lo definimos según mime
      if (!options.resource_type) {
        if (mimeType === 'application/pdf') {
          options.resource_type = 'raw'; // importante para PDFs
        } else if (mimeType.startsWith('image/')) {
          options.resource_type = 'image';
        } else {
          options.resource_type = 'auto';
        }
      }

      // Formar dataUri completo (Cloudinary acepta data URI también para raw)
      const dataUri = `data:${mimeType};base64,${base64}`;
      const uploadResult = await this.v2.uploader.upload(dataUri, options);
      return uploadResult;
    } catch (error) {
      throw new BadRequestException({
        message: 'Error al subir archivo a Cloudinary',
        error: (error && error.message) || error,
      });
    }
  }
```

**File:** src/auth/guards/roles.guard.ts (L11-46)
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest() as any;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    const roleMap: Record<number, string> = {
      1: 'agricultor',
      2: 'logistica',
      3: 'distribuidor',
      4: 'admin',
      5: 'auditor',
      6: 'mediador',
    };

    const userRole = roleMap[user.tipoUsuario];

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    return true;
  }
```

**File:** src/oferta-cultivo/dto/oferta-cultivo.dto.ts (L4-26)
```typescript
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

    @ApiProperty({ example: 'Jalisco', description: 'Entidad federativa donde aplica la oferta' })
    @IsString()
    @IsNotEmpty()
    entidad_federativa: string;
}
```

**File:** src/oferta-logistica/dto/oferta-logistica.dto.ts (L4-36)
```typescript
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
```

**File:** src/compra/compra.service.ts (L10-44)
```typescript
  async createCompra(userId: number, dto: CreateCompraDto) {
    // Verificar que el usuario es un distribuidor (id_tipo_user = 3)
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: { id_tipo_user: true }
    });
    
    if (!user || user.id_tipo_user !== 3) {
      throw new UnauthorizedException('Solo los distribuidores pueden realizar compras');
    }

    // Validar existencia de oferta_cultivo y cantidad disponible
    const oferta = await this.prisma.oferta_cultivo.findUnique({
      where: { id: dto.id_oferta_cultivo }
    });
    
    if (!oferta) {
      throw new NotFoundException('Oferta de cultivo no encontrada');
    }

    // Convertir a string para comparar cantidades decimales
    if (parseFloat(oferta.cantidad_disponible.toString()) < dto.cantidad_cultivo) {
      throw new UnauthorizedException('Cantidad solicitada no disponible');
    }

    // Si se provee oferta_logística, validar
    if (dto.id_oferta_logistica) {
      const ofertaLog = await this.prisma.oferta_logistica.findUnique({
        where: { id: dto.id_oferta_logistica }
      });
      if (!ofertaLog) {
        throw new NotFoundException('Oferta logística no encontrada');
      }
    }

```

**File:** src/compra/compra.service.ts (L218-222)
```typescript
      case TipoAprobacion.ENTREGA_DISTRIBUIDOR:
        updateData.aprobacion_distribuidor = true;
        updateData.fecha_entrega = now;
        updateData.estado = 'entregado';
        break;
```

**File:** src/compra/compra.service.ts (L224-228)
```typescript
      case TipoAprobacion.PAGO_LOGISTICA:
        updateData.aprobacion_logistica = true;
        updateData.fecha_pago_logistica = now;
        updateData.estado = 'pago_logistica_confirmado';
        break;
```

**File:** src/compra/compra.service.ts (L230-234)
```typescript
      case TipoAprobacion.PAGO_PRODUCTOR:
        updateData.aprobacion_productor = true;
        updateData.fecha_pago_productor = now;
        updateData.estado = compra.oferta_logistica ? 'completado' : 'completado_sin_logistica';
        break;
```

**File:** src/chat/chat.module.ts (L7-11)
```typescript
@Module({
    controllers : [ChatController],
    providers : [ChatService],
    imports : [PrismaPostgresModule, PrismaMongoModule]
})
```

**File:** src/creditos/credito.controller.ts (L15-21)
```typescript
    @Post('createCredito')
    @HttpCode(HttpStatus.CREATED)
    async createCredito (@Body() dto : CreateCreditoDto){
        const credito = await this.creditoService.createSoliCredito(dto)

        return {statusCode : HttpStatus.CREATED, message : 'Credito creado', data : credito}
    }
```

**File:** src/oferta-logistica/oferta-logistica.controller.ts (L16-18)
```typescript
  @Post()
  @Roles('logistica')
  @ApiOperation({ summary: 'Crear oferta logística', description: 'Crea una nueva oferta logística para una oferta de cultivo específica. Opcionalmente puede dirigirse a un distribuidor específico.' })
```

**File:** src/compra/compra.controller.ts (L17-18)
```typescript
  @Post()
  @Roles('distribuidor')
```

**File:** src/compra/compra.controller.ts (L106-107)
```typescript
  @Get('mis-compras')
  @Roles('distribuidor')
```
