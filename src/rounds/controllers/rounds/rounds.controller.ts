import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoundDto } from 'src/rounds/dto/CreateRound.dto';
import { RoundsService } from 'src/rounds/services/rounds/rounds.service';

@Controller('rounds')
export class RoundsController {
  constructor(private roundService: RoundsService) {}
}
