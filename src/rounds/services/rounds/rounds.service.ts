import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Round, RoundDocument } from 'schemas/round.schema';
import { CreateRoundDto } from 'src/rounds/dto/CreateRound.dto';

@Injectable()
export class RoundsService {
  constructor(@InjectModel('Round') private roundModel: Model<RoundDocument>) {}
  async create(createRoundDto: CreateRoundDto): Promise<Round> {
    const createdRound = new this.roundModel(createRoundDto);
    return createdRound.save();
  }

  async findAll(): Promise<Round[]> {
    return this.roundModel.find().populate('user').exec();
  }

  async find(user: string): Promise<Round[]> {
    return this.roundModel.find({ user: user }).exec();
  }

  async last4Records(): Promise<Round[]> {
    const distinctUsers = await this.roundModel.find().distinct('user').exec();
    const lastFourRoundsPerUser = await Promise.all(
      distinctUsers.map(async (user) => {
        const lastFourRoundsForUser = await this.roundModel
          .distinct('user')
          .sort({ createdAt: -1 }) // Sort by createdAt in descending order
          .findOne({ user })
          .populate('user', 'name')
          .exec();
        return lastFourRoundsForUser
          ? {
              ...lastFourRoundsForUser.toJSON(),
            }
          : null;
      }),
    );

    return lastFourRoundsPerUser.flat();
  }
}
