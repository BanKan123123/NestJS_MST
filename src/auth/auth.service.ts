import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDTO } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
     constructor(
          private prisma: PrismaService,
          private jwt: JwtService,
          private config: ConfigService,
     ) {}
     async login(auth: AuthDTO) {
          // find the user By email
          const user = await this.prisma.user.findUnique({
               where: { email: auth.email },
          });

          // if user does not exist throw exception

          if (!user) throw new ForbiddenException('Credentials incorrect');

          // Compare password

          const comparePassword = await argon.verify(user.password, auth.password);
          // If password incorrect throw exception

          if (!comparePassword) throw new ForbiddenException('Credentials incorrect');
          // send back the user;

          // delete user.password;

          return this.signToken(user.id, user.email);
     }

     async signUp(auth: AuthDTO) {
          // generate the password hash
          const hash = await argon.hash(auth.password);
          // save the new user in the DB
          try {
               const user = await this.prisma.user.create({
                    data: {
                         email: auth.email,
                         password: hash,
                    },
               });
               // delete user.password;
               // Return the saved user
               return this.signToken(user.id, user.email);
          } catch (error) {
               if (error instanceof PrismaClientKnownRequestError) {
                    if (error.code === 'P2002') {
                         throw new ForbiddenException('Credentials taken');
                    }
               }
               throw error;
          }
     }

     async signToken(userId: number, email: string): Promise<{ accessToken: string; refreshToken: string }> {
          const payload = {
               sub: userId,
               email,
          };

          const secret = this.config.get('JWT_SECRET');
          const refreshSecret = this.config.get('REFRESH_TOKEN');

          const accessToken = await this.jwt.signAsync(payload, {
               expiresIn: '15m',
               secret: secret,
          });

          const refreshToken = await this.jwt.signAsync(payload, {
               expiresIn: '7d',
               secret: refreshSecret,
          });

          return {
               accessToken,
               refreshToken,
          };
     }

     async refresh(refreshToken: string) {
          try {
               const decoded = this.jwt.verify(refreshToken, {
                    secret: this.config.get('REFRESH_TOKEN'),
               });

               const accessToken = this.jwt.sign(
                    {
                         email: decoded.email,
                         sub: decoded.sub,
                    },
                    {
                         secret: this.config.get('JWT_SECRET'),
                         expiresIn: '15m',
                    },
               );
               return { accessToken };
          } catch (err) {
               throw new UnauthorizedException(err);
          }
     }
}
