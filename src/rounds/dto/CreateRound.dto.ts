import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from 'schemas/user.schema';

export class CreateRoundDto {
  user: User;
  @IsNotEmpty()
  points: number;
  @IsNotEmpty()
  multiplier: number;
  @IsNotEmpty()
  score: number;
  @IsNotEmpty()
  guess: number;
}
