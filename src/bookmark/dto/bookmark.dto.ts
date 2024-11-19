import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class BookMarkDTO {
     @IsString()
     @IsNotEmpty()
     title: string;

     @IsString()
     @IsNotEmpty()
     description: string;

     @IsString()
     @IsNotEmpty()
     link: string;

     @IsNumber()
     @IsNotEmpty()
     userId: number;
}
