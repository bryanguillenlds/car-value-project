import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

//Test Block/Closure
it('can create an instance of auth service', async () => {
  //Creat fake copy of users service
  const fakeUsersService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password }),
  };
  //Create testing module with needed providers (compile it)
  const module = await Test.createTestingModule({
    providers: [
      AuthService,
      //If anyone asks for the UserService...
      //Use the fakeusersservice for testing purposes
      { provide: UsersService, useValue: fakeUsersService },
    ],
  }).compile();

  //Get the service and dependencies and initialize them
  const service = module.get(AuthService);

  expect(service).toBeDefined();
});
