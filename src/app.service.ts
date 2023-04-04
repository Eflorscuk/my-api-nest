import {
  Injectable,
  HttpException,
  HttpStatus,
  Body,
  Param,
} from '@nestjs/common';
import axios from 'axios';
import { CreateUserDto } from './create-user.dto';
import * as amqp from 'amqplib';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { UserAvatarModel } from './user-avatar.schema';
//import { User } from './user.schema';

const url = 'https://reqres.in/api/users';
@Injectable()
export class AppService {
  private readonly rabbitmqUrl: string = 'amqp://localhost';
  private readonly userQueue: string = 'user-queue';

  async createNewUser(@Body() createUserDto: CreateUserDto) {
    const users = await axios.get(`${url}`);
    const response = users.data.data;
    const userExists = response.find((user) => user.id === createUserDto.id);

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new userExists(createUserDto);
    await createdUser.save();

    const connection = await amqp.connect(this.rabbitmqUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(this.userQueue);

    const message = JSON.stringify(createUserDto);

    channel.sendToQueue(this.userQueue, Buffer.from(message));

    await channel.close();
    await connection.close();

    return { message: 'User created successfully' };
  }
  async deleteUserAvatar(@Param('id') id: string) {
    const userAvatar = await axios.get(`${url}/${id}`);

    if (!userAvatar) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedUserId = crypto.createHash('md5').update(id).digest('hex');
    const imagePath = path.join(__dirname, '..', 'avatars', `${hashedUserId}`);

    try {
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error(`Error deleting file: ${error}`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'User avatar deleted sucessfully ' };
  }
  async getAllUsers() {
    try {
      const config = {
        timeout: 10000,
      };
      const users = await axios.get(`${url}`, config);
      const response = users.data.data;

      if (!response) {
        throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
      }

      return response;
    } catch (error) {
      throw new HttpException('Request timed out', HttpStatus.REQUEST_TIMEOUT);
    }
  }
  async getUserAvatar(@Param('id') id: string) {
    try {
      const config = {
        timeout: 10000,
      };
      const userIdAvatar = await axios.get(`${url}/${id}`, config);
      const response = userIdAvatar.data.data;

      if (!response) {
        throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
      }

      const { avatar } = response;

      if (!avatar) {
        throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
      }

      const hashedUserId = crypto.createHash('md5').update(id).digest('hex');
      const imagePath = path.join(
        __dirname,
        '..',
        'avatars',
        `${hashedUserId}`,
      );
      const image = await axios.get(avatar, { responseType: 'arraybuffer' });
      fs.writeFileSync(imagePath, image.data);

      const newUserAvatar = new UserAvatarModel({
        userId: id,
        image,
      });

      await newUserAvatar.save();
      return { avatar: image.data.toString('base64') };
    } catch (error) {
      throw new HttpException('Request timed out', HttpStatus.REQUEST_TIMEOUT);
    }
  }
  async getUserId(@Param('id') id: string) {
    try {
      const config = {
        timeout: 10000,
      };
      const userId = await axios.get(`${url}/${id}`, config);
      const response = userId.data.data;
      if (!response) {
        throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
      }
      return response;
    } catch (error) {
      throw new HttpException('Request timed out', HttpStatus.REQUEST_TIMEOUT);
    }
  }
}
