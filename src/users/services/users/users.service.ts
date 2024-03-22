import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import slugify from 'slugify';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel({
      ...createUserDto,
      slug: slugify(createUserDto.name, {
        lower: true,
      }),
    });
    const check = await this.find(createUserDto);
    if (check) {
      return check;
    } else {
      return createdUser.save();
    }
  }
  async find(createUserDto: CreateUserDto): Promise<User> {
    const slug = slugify(createUserDto.name, {
      lower: true,
    });
    return await this.userModel.findOne({ slug }).exec();
  }

  async findById(id: any): Promise<User> {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  async findAllExpect(id: any): Promise<User[]> {
    return this.userModel.find({ _id: { $ne: id } }).exec();
  }
}
