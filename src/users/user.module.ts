import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { PrismaPostgresModule } from "src/prisma/prismaPostgres.module";
import { UserService } from "./user.service";
import { PrismaMongoModule } from "src/prisma/prismaMongo.module";
//import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { AuthModule } from "src/auth/auth.module";
import { TokensModule } from "src/tokens/tokens.module";

@Module({
    controllers : [UserController],
    providers : [UserService],
    imports : [
        PrismaPostgresModule, PrismaMongoModule, 
       // CloudinaryModule,
    AuthModule,TokensModule]
})
export class UserModule {

}