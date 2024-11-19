import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshTokenInterceptor } from './interceptor/refresh-token.interceptor';

@Module({
     imports: [PrismaModule, JwtModule.register({})],
     controllers: [AuthController],
     providers: [AuthService, JwtStrategy, RefreshTokenInterceptor],
     exports: [AuthService],
})
export class AuthModule {}
