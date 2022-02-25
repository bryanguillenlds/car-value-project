import { AuthService } from './auth.service';
import { UserDto } from './dtos/user.dto';
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
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';

//Serialize is our own decorator that has the UseInterceptors decorator embeded
//to intercept the response from all endpoints
@Serialize(UserDto)
@Controller('auth') //auth route prefix
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  //POST Decorator
  //Using body decorator to extract body from request
  //Using DTO for validation
  //Using auth service to sign up
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    //use auth service to create a user
    return this.authService.signup(body.email, body.password);
  }

  //POST decorator
  //Using body decorator to extract body from request
  //Using DTO for validation
  //Using auth service to sign in
  @Post('/signin')
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
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
