import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
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

  @Post()
  
}
