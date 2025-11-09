import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaServicePostgres } from '../prisma/prismaPosgres.service';
import { AccessLoginDto } from './dto/access.dto';
import * as bcrypt from 'bcrypt';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class AccessService {
  constructor(
    private prismaPostgres: PrismaServicePostgres,
    private tokensService: TokensService,
  ) {}

  async loginUser(userLogin: AccessLoginDto) {
    const findUser = await this.prismaPostgres.usuario.findUnique({
      where: { email: userLogin.email },
      include: {
        tipo_user: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          },
        },
      },
    });

    if (!findUser) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if(findUser.status == 0){
      throw new ForbiddenException('El usuario está inhabilitado. Contacte al administrador.')
    }

    const isPasswordValid = await bcrypt.compare(
      userLogin.contra,
      findUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = await this.tokensService.createAccessToken(findUser);
    const refreshToken = await this.tokensService.createRefreshToken(findUser);

    const now = new Date();
    const expirationDate = new Date(now.getTime() + 30 * 60000);

    const returnUser = {
      id: findUser.id,
      username: findUser.username,
      email: findUser.email,
      status : findUser.status,
      id_tipo_user: findUser.tipo_user,
    };

    await this.prismaPostgres.sesion.create({
      data: {
        id_usuario: findUser.id,
        token_acceso: accessToken,
        token_refresh: refreshToken,
        fecha_creacion: now,
        fecha_expiracion: expirationDate,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: returnUser,
    };
  }

  async logoutUser(refreshToken: string) {
    await this.tokensService.validateRefreshToken(refreshToken);

    const result = await this.prismaPostgres.sesion.deleteMany({
      where: { token_refresh: refreshToken },
    });

    if (result.count === 0) {
      throw new UnauthorizedException('Session already closed or not found');
    }
    return { message: 'Session closed' };
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.tokensService.validateRefreshToken(refreshToken);

    const user = await this.prismaPostgres.usuario.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const newAccessToken = await this.tokensService.createAccessToken(user);
    const newRefreshToken = await this.tokensService.createRefreshToken(user);

    await this.prismaPostgres.sesion.updateMany({
      where: {
        token_refresh: refreshToken,
        id_usuario: user.id,
      },
      data: {
        token_acceso: newAccessToken,
        token_refresh: newRefreshToken,
        fecha_expiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
