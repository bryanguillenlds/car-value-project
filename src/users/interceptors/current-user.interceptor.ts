import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

//Mark as injectable to be used in the Dependency Injection System
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    //retrieve request from context
    const request = context.switchToHttp().getRequest();
    //retrieve userId from request's session data
    const { userId } = request.session || {};

    //if user is logged in
    if (userId) {
      //find user
      const user = await this.usersService.findOne(userId);
      //assign user to request so we have the current user
      request.currentUser = user;
    }

    return handler.handle();
  }
}
