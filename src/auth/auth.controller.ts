import { Controller, Get, Post, Body, HttpCode, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('sign-up')
    async signUp(@Body() dto: SignUpDto) {
        const existingUser = await this.authService.checkUser(dto.email);
        if (existingUser) throw new HttpException({ error: 'Credentials Taken' }, 400);
        return this.authService.signUp(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Body() dto: SignInDto) {
        const existingUser = await this.authService.checkUser(dto.email);
        if (!existingUser) throw new HttpException({ error: 'User not found.' }, 400);
        return this.authService.signIn(existingUser, dto);
    }

    @Get('request-reset-password/:email')
    async requestResetPassword(@Param('email') email: string) {
        const existingUser = await this.authService.checkUser(email);
        if (!existingUser) throw new HttpException({ error: 'User not found.' }, 400);
        return this.authService.requestResetPassword(existingUser);
    }

    @HttpCode(HttpStatus.OK)
    @Post('reset-password/:reset_token')
    resetPassword(@Param('reset_token') resetToken: string, @Body('new_password') newPassword: string) {
        return this.authService.resetPassword(resetToken, newPassword);
    }
}
