import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //whenever creating an instance of the app
      provide: APP_PIPE,
      //use the validation pipe globally
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  //configure a global middleware
  //this will be automatically called when listening for incoming requests
  configure(consumer: MiddlewareConsumer) {
    //apply the middleware for cookie-session
    consumer
      .apply(
        cookieSession({
          keys: ['asdf'],
        }),
      )
      .forRoutes('*'); //chain forRoutes(*) to apply this middleware to all routes
  }
}
