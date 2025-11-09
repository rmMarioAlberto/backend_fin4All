import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { PrismaPostgresModule } from "../prisma/prismaPostgres.module";
import { UserService } from "./user.service";
import { PrismaMongoModule } from "../prisma/prismaMongo.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { AuthModule } from "../auth/auth.module";
import { TokensModule } from "../tokens/tokens.module";

@Module({
    controllers : [UserController],
    providers : [UserService],
    imports : [
        PrismaPostgresModule, PrismaMongoModule, 
       CloudinaryModule,
    AuthModule,TokensModule]
})
export class UserModule {

}