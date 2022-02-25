import { UsersService } from './users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

//Scrypt reeturns a callback but we need a promise
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  //constructor passing user service
  constructor(private usersService: UsersService) {}

  //Method for registering a user
  //passing email & passwrd
  async signup(email: string, password: string) {
    //See if email is already used
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    //Generate Salt
    const salt = randomBytes(8).toString('hex');
    //Hash salt and passwrd
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //Join hashed result and salt in the format its going to be saved
    const result = salt + '.' + hash.toString('hex');

    //Create new user and save it
    const user = await this.usersService.create(email, result);

    //Return user
    return user;
  }

  signin() {}
}
