import { UpdateUserDto } from './dtos/update-user.dto';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth') //auth route prefix
export class UsersController {
  constructor(private usersService: UsersService) {}

  //POST Decorator
  //Using body decorator to extract body from request
  //Using DTO for validation
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    //use service to create a user
    this.usersService.create(body.email, body.password);
  }

  //GET Decorator for one record
  //Use param decorator to extract the wild card
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    //Use service to find a specific user
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) throw new NotFoundException('User Not Found');

    return user;
  }

  //GET Decorator for all records
  //Use Query decorator to extract email query param from path
  @Get()
  findAllUsers(@Query('email') email: string) {
    //Use service to find all users with given email
    return this.usersService.find(email);
  }

  //PATCH Decorator for a record update
  //Using body decorator to extract body from request
  //Using DTO for validation
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    //User service to update
    return this.usersService.update(parseInt(id), body);
  }

  //DELETE Decorator for one record
  //Use param decorator to extract the wild card
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    //Use service to delete a specific user
    return this.usersService.remove(parseInt(id));
  }
}
