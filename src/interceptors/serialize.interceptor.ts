import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { handleRetry } from '@nestjs/typeorm';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //Context is an interface that contains the request details
    //If you want to do something to the context before the request is processed,
    //you put it outside the return statement...here.
    console.log('Runs before handler', context);

    //Handler is an interface that contains the response stream
    //Handle returns the response details
    //Pipe is used to perform something with the response details (an observable)
    //If you want to do something to the response before sending it, you put
    //it inside the return statement so it can be mapped/transformed.
    return handler.handle().pipe(
      //Map transforms the observable
      map((data: any) => {
        //Runs before response is sent out
        console.log('Runs before response is sent', data);
      }),
    );
  }
}
