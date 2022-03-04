import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  //Creat fake copy of users service
  const fakeUsersService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password }),
  };

  beforeEach(async () => {
    //Create testing module with needed providers (compile it)
    const module = await Test.createTestingModule({
      providers: [
        //Provide the fakeusersservice for testing purposes
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
