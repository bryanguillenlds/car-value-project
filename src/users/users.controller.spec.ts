import { User } from './user.entity';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve([
          { id: 1, email: 'test@test.com', password: '123' } as User,
        ]),
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: '123',
        } as User),
    };

    fakeAuthService = {
      // //signup mock
      // signup: () => {},
      // //signin mock
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        //Provide the fakeusersservice and fakeauthservice for testing purposes
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser returns a user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(() => controller.findUser('1')).rejects.toThrow(
      'User Not Found',
    );
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'test@test.com', password: '123' },
      session,
    );

    expect(user.id).toEqual(1); //1 because mock is hard coded for this
    expect(session.userId).toEqual(1);
  });
});
