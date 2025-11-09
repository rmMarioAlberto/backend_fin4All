import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { PrismaPostgresModule } from "src/prisma/prismaPostgres.module";
import { PrismaMongoModule } from "src/prisma/prismaMongo.module";

@Module({
    controllers : [ChatController],
    providers : [ChatService],
    imports : [PrismaPostgresModule, PrismaMongoModule]
})
export class ChatModule {
    
}