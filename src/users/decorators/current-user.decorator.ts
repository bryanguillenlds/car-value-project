import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Creating a decorator to be used as a param
export const CurrentUser = createParamDecorator(
  //Context is a wrapper for the incoming req.
  //Data is whatever is provided/passed into the decorator.
  //type is never because it will never be passed or accessed
  (data: never, context: ExecutionContext) => {
    //retrieve request from context
    const request = context.switchToHttp().getRequest();
    //Return the current user (that will now be available thanks to
    //the interceptor that will handle assigning the user to the request).
    return request.currentUser;
  },
);
