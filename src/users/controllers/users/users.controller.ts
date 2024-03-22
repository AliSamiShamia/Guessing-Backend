import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoundsService } from 'src/rounds/services/rounds/rounds.service';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { AuthService } from 'src/users/services/auth.service';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private readonly roundsService: RoundsService,
  ) {}

  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);
    const token = await this.authService.generateToken(user);
    return {
      name: user.name,
      slug: user.slug,
      id: user.id,
      token: token.access_token,
    };
  }

  @Post('/profile')
  async profile(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const [prefix, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedException(
        'Token not found in authorization header',
      );
    }

    try {
      const res = await this.authService.verifyToken(token);
      const user = await this.userService.findById(res.sub);

      if (user) {
        const refreshToken = await this.authService.generateToken(user);
        const rounds = await this.roundsService.find(user.id);
        let newScore = 0;
        rounds.forEach((round) => {
          newScore += round.score;
        });

        return {
          name: user.name,
          slug: user.slug,
          id: user.id,
          token: refreshToken.access_token,
          score: newScore > 0 ? newScore : 0,
        };
      }
      return null;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
