import { Module } from '@nestjs/common';
import { ChatsService } from './services/chats/chats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from 'schemas/chat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }])],
  providers: [ChatsService],
})
export class ChatsModule {}
