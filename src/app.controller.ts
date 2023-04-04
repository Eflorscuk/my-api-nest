import { Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './create-user.dto';
//import axios from 'axios';

//const url = 'https://reqres.in/api/users';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*@Get()
  getHello(): string {
    return this.appService.getHello();
  }*/

  @Get()
  async getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Get(':id/')
  async getUserId(@Param('id') id: string) {
    return this.appService.getUserId(id);
  }

  @Post()
  async createNewUser(createUserDto: CreateUserDto) {
    return this.appService.createNewUser(createUserDto);
  }

  @Get(':id/avatar')
  async getUserAvatar(@Param('id') id: string) {
    return this.appService.getUserAvatar(id);
  }
}
