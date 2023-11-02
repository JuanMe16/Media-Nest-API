import { IsString, IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'example@gmail.com', description: 'Email of a user account.' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '123abc', description: 'Password of a user account.' })
    password: string;
}