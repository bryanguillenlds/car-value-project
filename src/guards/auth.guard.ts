import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  //Method to access the request and return true or false
  //based on if the user is logged in
  canActivate(context: ExecutionContext) {
    //retrieve the request
    const request = context.switchToHttp().getRequest();

    //return the id if exists
    return request.session.userId;
  }
}
