import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth') //auth route prefix
export class UsersController {
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    //use service to create a user
  }
}
