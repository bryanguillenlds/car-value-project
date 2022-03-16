import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest(); //grab request

    if (!request.currentUser) return false; //if no user, exit

    return request.currentUser.admin; //return if admin is true or false
  }
}
