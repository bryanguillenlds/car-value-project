import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth') //auth route prefix
export class UsersController {
  constructor(private usersService: UsersService) {}

  //POST Decorator
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    //use service to create a user
    this.usersService.create(body.email, body.password);
  }

  //GET Decorator for one record
  //Use param decorator to extract the wild card
  @Get('/:id')
  findUser(@Param('id') id: string) {
    //Use service to find a specific user
    return this.usersService.findOne(parseInt(id));
  }

  //GET Decorator for all records
  //Use Query decorator to extract email query param from path
  @Get()
  findAllUsers(@Query('email') email: string) {
    //Use service to find all users with given email
    return this.usersService.find(email);
  }

  //DELETE Decorator for one record
  //Use param decorator to extract the wild card
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    //Use service to delete a specific user
    return this.usersService.remove(parseInt(id));
  }
}
