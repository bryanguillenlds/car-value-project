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
    //Arr of Users to use in each test
    const users: User[] = [];

    //Creat fake copy (Mock) of users service
    //to use in each test
    fakeUsersService = {
      //Mock Find.
      find: (email: string) => {
        //Filter users in arr who match email
        const filteredUsers = users.filter((user) => user.email === email);
        //return match wrapped in promise (because it is async code)
        return Promise.resolve(filteredUsers);
      },
      //Mock Create.
      create: (email: string, password: string) => {
        //Create a User with provided email and pswrd
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        //Push to arr of users
        users.push(user);
        //return wrapped in promise
        return Promise.resolve(user);
      },
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
    //sign up a user with the same email we want to test so that it
    //already exists
    await service.signup('testing@test.com', '123');

    //Test that the method throws if find actually returned an email
    //it will because we are mocking it above)
    await expect(() =>
      service.signup('testing@test.com', '123'),
    ).rejects.toThrow('Email in use');

    //ALTERNATIVE BELOW
    // await expect(
    //   service.signup('testing@test.com', '123'),
    // ).rejects.toBeInstanceOf(BadRequestException);
  });

  //Test for non existing email
  it('throws error if signin is called with non-existing email', async () => {
    //Test that the method throws if no email is registered.
    //It will, because before each test the array of users is empty
    await expect(() =>
      service.signin('testing@test.com', '123'),
    ).rejects.toThrow('User Not Found');
  });

  //Test
  it('throws if invalid password is provided', async () => {
    //sign up a user so that we can test signing in with
    //different passwrd later
    await service.signup('test3@testing.com', '1234');

    //test signing in with different passwrd
    await expect(() =>
      service.signin('test3@testing.com', '123'),
    ).rejects.toThrow('Bad Password');
  });

  it('returns user if correct password is provided', async () => {
    await service.signup('test4@testing.com', '123');

    const user = await service.signin('test4@testing.com', '123');
    expect(user).toBeDefined();
  });
});
