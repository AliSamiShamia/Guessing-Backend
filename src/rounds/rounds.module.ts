import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoundSchema } from 'schemas/round.schema';
import { RoundsService } from './services/rounds/rounds.service';
import { RoundsController } from './controllers/rounds/rounds.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Round', schema: RoundSchema }]),
  ],
  providers: [RoundsService],
  controllers: [RoundsController],
  exports: [RoundsService],
})
export class RoundModule {}
