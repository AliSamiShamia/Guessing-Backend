import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from 'schemas/user.schema';

export class CreateMessageDto {
  user: User;
  @IsNotEmpty()
  msg: string;
  
}
