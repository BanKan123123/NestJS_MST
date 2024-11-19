import { Injectable } from '@nestjs/common';
import UserEditDTO from './dto/user-edit.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
     constructor(private prisma: PrismaService) {}
     async editUser(userId: number, user: UserEditDTO) {
          const userEdit = await this.prisma.user.update({
               where: { id: userId },
               data: { ...user },
          });
          delete userEdit.password;

          return userEdit;
     }
}
