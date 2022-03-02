import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

//making our own type safety interface
//so that Serialize only accepts Classes
interface ClassConstructor {
  new (...args: any[]): {};
}

//define custom decorator function
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  //Constructor for Interceptor
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //Context is an interface that contains the request details
    //If you want to do something to the context before the request is processed,
    //you put it outside the return statement...HERE.
    // console.log('Runs before handler', context);

    //Handler is an interface that contains the response stream
    //Handle returns the response details
    //Pipe is used to perform something with the response details (an observable)
    //If you want to do something to the response before sending it, you put
    //it inside the return statement so it can be mapped/transformed.
    return handler.handle().pipe(
      //Map transforms the observable
      //Data is the Entity being mapped/transformed
      map((data: any) => {
        //This Runs before response is sent out

        //Turn the User Entity into a User DTO
        //using plainToClass. 1st Arg is what you want to turn into
        //2nd Arg is what is being turned, 3rd is config options
        //passing excludeExtraneuous so that only what's marked with decorator EXPOSED
        //is sent out
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
