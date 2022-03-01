import { Injectable, NotFoundException } from '@nestjs/common';
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

  //Method to GET one user
  findOne(id: number) {
    //if no id (for example if session.userId is null) return null
    if (!id) return null;
    //use repo to query
    return this.repo.findOne(id);
  }

  //Method to GET all users
  find(email: string) {
    //use repo to query
    //pass obj with email as quert criteria
    return this.repo.find({ email });
  }

  //Method to UPDATE/PATCH a user
  async update(id: number, attrs: Partial<User>) {
    //Use our own method to find the record we want
    //to update
    const user = await this.findOne(id);

    //Throw Error if we haven't found it
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //If we found it, assign changes to the obj
    Object.assign(user, attrs);

    //Save the update to the DB
    return this.repo.save(user);
  }

  //Method to DELETE a user
  async remove(id: number) {
    //Use our own method to find the record we want
    //to delete
    const user = await this.findOne(id);

    //Throw Error if we haven't found it
    if (!user) {
      throw new NotFoundException('User not found');
    }

    //Remove from DB passing user entity
    return this.repo.remove(user);
  }
}
