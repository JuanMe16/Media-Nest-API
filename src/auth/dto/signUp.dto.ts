import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEmail, IsNotEmpty } from "class-validator";

export class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'example@gmail.com', description: 'Email to open an user account.' })
    email: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'example', description: 'Optional username to add to your user account.' })
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '123abc', description: 'Password to secure your user account.' })
    password: string;
}