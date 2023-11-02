import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto, SignInDto } from './dto';
import { User } from './auth.entity';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async checkUser(email: string) {
        const userFound = await this.userRepository.findOne({ where: { email } });
        return userFound ? userFound : false;
    }

    async signUp(dto: SignUpDto) {
        const hashedPassword = await argon.hash(dto.password);
        const newUser = this.userRepository.create({ ...dto, password: hashedPassword });
        this.userRepository.save(newUser);
        return { msg: 'User successfully created!' };
    }

    async signIn(userFound: User, dto: SignInDto) {
        const result = await argon.verify(userFound.password, dto.password);
        if (result) {
            const payload = { id: userFound.id, email: userFound.email };
            const token = this.jwtService.sign(payload);
            return { token };
        } else {
            throw new HttpException({ error: 'Invalid credentials.' }, 400);
        }
    }

    requestResetPassword(userFound: User) {
        console.log(`We have just sent to your email ${userFound.email}.`);
        return { msg: 'We have just sent an email to continue your reset password.' };
    }

    resetPassword(resetToken: string, newPassword: string) {
        console.log(resetToken, newPassword);
        return { msg: 'Password successfully resetted.' };
    }

}
