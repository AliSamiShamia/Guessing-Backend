import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'schemas/chat.schema';
import { CreateMessageDto } from 'src/chats/dto/CreateMessage.dto';

@Injectable()
export class ChatsService {
  constructor(@InjectModel('Chat') private chatModel: Model<ChatDocument>) {}
  async create(createRoundDto: CreateMessageDto): Promise<Chat> {
    const createdRound = new this.chatModel(createRoundDto);
    return createdRound.save();
  }

  async findAll(): Promise<Chat[]> {
    const chats = await this.chatModel
      .find()
      .limit(15)
      .populate('user', 'name')
      .exec();

    return chats.flat();
  }
}
