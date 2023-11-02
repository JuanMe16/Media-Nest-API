import { CanActivate, ExecutionContext, Injectable, HttpException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger();

  constructor(private jwtService: JwtService) { }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type == 'Bearer' ? token : '';
  }

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new HttpException({ error: 'You are not authenticated.' }, 401);
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      this.logger.debug(`AuthGuard: ${payload['email']} has been verificated.`);
    } catch (error) {
      this.logger.debug(`${error} at request with token ${token}`);
      throw new HttpException({ error: 'Invalid token.' }, 400);
    }
    return true;
  }
}
