import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDTO {
     @IsNotEmpty()
     @IsEmail()
     email: string;

     @IsString()
     @IsNotEmpty()
     password: string;
}
