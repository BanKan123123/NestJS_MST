import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class UserEditDTO {
     @IsEmail()
     email: string;

     @IsString()
     firstName: string;

     @IsString()
     lastName: string;
}
