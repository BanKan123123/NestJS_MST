import { Body, Controller, Get, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UserService } from './user.service';
import UserEditDTO from './dto/user-edit.dto';
import { RefreshTokenInterceptor } from '../auth/interceptor/refresh-token.interceptor';

@UseGuards(JwtGuard)
@Controller('users')
@UseInterceptors(RefreshTokenInterceptor)
export class UserController {
     constructor(private userService: UserService) {}
     @Get('me')
     getUser(@GetUser() user: User) {
          return user;
     }
     @Patch('edit')
     editUser(@GetUser('id') userId: number, @Body() user: UserEditDTO) {
          this.userService.editUser(userId, user);
     }
}
