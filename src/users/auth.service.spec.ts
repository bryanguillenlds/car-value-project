import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';

//Test suite
describe('Auth Service', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  //Before each test, define the fakeUserService
  //instantiate the module and get the service.
  beforeEach(async () => {
    //Creat fake copy of users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
    service = module.get(AuthService);
  });

  //Test Block/Closure to test that the auth service
  //gets instantiated
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  //Test that the password is hashed
  it('creats new user with salted and hashed password', async () => {
    //sign up a fake user
    const user = await service.signup('testing@test.com', '123');

    //resulting password should not be the same as provided
    expect(user.password).not.toEqual('123');

    //split salt and hash on period
    const [salt, hash] = user.password.split('.');

    //test that both are defined
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws error if user signs up with existing email', async () => {
    //modify fake service's find method for this specific test
    //to make it so that it returns as if it found something
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'test2@testing.com', password: '123' } as User,
      ]);

    //Test that the method throws if find actually returned an email (it will because we are mocking it above)
    await expect(() =>
      service.signup('testing@test.com', '123'),
    ).rejects.toThrow('Email in use');

    //ALTERNATIVE BELOW
    // await expect(
    //   service.signup('testing@test.com', '123'),
    // ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws error if signin is called with non-existing email', async () => {
    //Test that the method throws if no email is registered(it will because of original
    //fake service implementation of find)
    await expect(() =>
      service.signin('testing@test.com', '123'),
    ).rejects.toThrow('User Not Found');
  });
});
