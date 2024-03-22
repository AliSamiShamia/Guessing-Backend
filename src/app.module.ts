import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { RoundModule } from './rounds/rounds.module';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseProviders } from './mongodb.providers';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from 'response';
import { SocketGateway } from './socket/socket.gateway';
import { ConfigModule } from '@nestjs/config';
import { RoundsService } from './rounds/services/rounds/rounds.service';
import { RoundSchema } from 'schemas/round.schema';
import { UserSchema } from 'schemas/user.schema';
import { UsersService } from './users/services/users/users.service';
import { AuthService } from './users/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ChatsModule } from './chats/chats.module';
import { ChatsService } from './chats/services/chats/chats.service';
import { ChatSchema } from 'schemas/chat.schema';

@Module({
  imports: [
    UserModule,
    RoundModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Round', schema: RoundSchema }]),
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DB_URL,
        dbName: 'game',
      }),
    }),
    ChatsModule,
  ],
  controllers: [],
  providers: [
    ...databaseProviders,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    SocketGateway,
    RoundsService,
    UsersService,
    AuthService,
    JwtService,
    ChatsService,
  ],
})
export class AppModule {}
