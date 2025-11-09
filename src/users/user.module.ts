import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { PrismaPostgresModule } from "src/prisma/prismaPostgres.module";
import { UserService } from "./user.service";

@Module({
    controllers : [UserController],
    providers : [UserService],
    imports : [PrismaPostgresModule]
})
export class UserModule {

}