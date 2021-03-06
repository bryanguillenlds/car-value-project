import { User } from './../user.entity';
import { UsersService } from './../users.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

declare global {
  //find express
  namespace Express {
    //grab the req
    interface Request {
      //tell it that it will have a currentUser prop
      //that has a type of User entity
      currentUser?: User;
    }
  }
}

//Make class injectable so that we can inject our user service
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  //define cosntructor with user service
  constructor(private usersService: UsersService) {}

  //middlewares need the use method to access the incoming req
  async use(req: Request, res: Response, next: NextFunction) {
    //grab userId from the session
    const { userId } = req.session || {};

    //if there is a user
    if (userId) {
      //find that user
      const user = await this.usersService.findOne(userId);

      //assign it to the currentUser on the req.
      req.currentUser = user;
    }

    //exit this middleware
    next();
  }
}
