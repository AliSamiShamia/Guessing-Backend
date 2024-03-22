import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'schemas/user.schema';
import { UsersService } from './services/users/users.service';
import { UsersController } from './controllers/users/users.controller';
import { AuthService } from './services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { RoundModule } from 'src/rounds/rounds.module';
import { RoundsService } from 'src/rounds/services/rounds/rounds.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    RoundModule,
  ],
  providers: [UsersService, AuthService, JwtService],
  controllers: [UsersController],
})
export class UserModule {}
