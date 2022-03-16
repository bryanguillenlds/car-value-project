import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { AuthService } from './auth.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {
  //configure the module for middlwares and etc.
  configure(consumer: MiddlewareConsumer) {
    //apply the middleware to all routes
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
