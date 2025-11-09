import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { AddMessageDto, GetChat } from './dto/chat.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('getChat')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiQuery({ name: 'idPublicacion', type: Number, required: true })
  @ApiQuery({ name: 'idUsuarioPropietario', type: Number, required: true })
  @ApiQuery({ name: 'idUsuarioCliente', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Chat obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Publicación o chat no encontrado' })
  async getChat(@Body() dto: GetChat) {
    return await this.chatService.getChat(dto);
  }

  @Post('agregarMensaje')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: AddMessageDto })
  @ApiResponse({ status: 201, description: 'Mensaje agregado correctamente' })
  async agregarMensaje(@Body() dto: AddMessageDto) {
    return await this.chatService.agregarMensaje(dto);
  }
}
