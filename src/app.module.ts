import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { BookmarkController } from './bookmark/bookmark.controller';
import { BookmarkService } from './bookmark/bookmark.service';
import { ProxyService } from './proxy/proxy.service';
import { CsrfMiddleware } from './middleware/csrf.middleware';

@Module({
     imports: [
          AuthModule,
          PrismaModule,
          ConfigModule.forRoot({
               isGlobal: true,
          }),
     ],
     controllers: [AppController, UserController, BookmarkController],
     providers: [AppService, PrismaService, UserService, BookmarkService, ProxyService],
})
export class AppModule implements NestModule {
     configure(consumer: MiddlewareConsumer) {
          // consumer.apply(CsrfMiddleware).forRoutes('/users');
     }
}
