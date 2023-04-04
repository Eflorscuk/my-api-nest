import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

const url = 'https://reqres.in/api/users';
@Injectable()
export class AppService {
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
}
