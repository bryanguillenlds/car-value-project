import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  //1. Constructor with repo being passed as private
  //so that it is abbreviate and already assigned/defined
  //2. Repo is of type Repository with a generic type of user
  //so that the Repository from typeorm is instantiated for Users
  //3. InjectRepository helps the injection system work with generic types for the repo
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  //Method to create a User
  create(email: string, password: string) {
    //Use Repo(typeORM) to create a user entity
    //We do this so that we create a valid instance before saving into DB
    const user = this.repo.create({ email, password });

    //save that user entity into DB
    return this.repo.save(user);
  }
}
