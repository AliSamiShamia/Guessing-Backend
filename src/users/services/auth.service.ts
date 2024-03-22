import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: any) {
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: 'secret' }),
    };
  }
  async verifyToken(token: any) {
    return {
      ...this.jwtService.verify(token, { secret: 'secret' }),
    };
  }
}
