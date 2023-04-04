import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateUserDto } from './create-user.dto';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  avatar: string;

  static createNew(user: CreateUserDto): User {
    const newUser = new User();
    newUser.id = user.id;
    newUser.email = user.email;
    newUser.first_name = user.first_name;
    newUser.last_name = user.last_name;
    newUser.avatar = user.avatar;
    return newUser;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
