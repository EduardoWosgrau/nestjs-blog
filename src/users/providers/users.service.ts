import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   * Constructor for users service
   * @param authService auth service circular injection
   * @param usersRepository authentication service
   */
  constructor(
    // Injecting Auth Service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    // Injecting Users Repository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // Injecting Configuration Service
    private readonly configService: ConfigService,
  ) {}

  /**
   * Method to get all the users from the database
   */
  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const enviroment = this.configService.get<string>('S3_BUCKET');
    console.log(enviroment);
    const isAuth = this.authService.isAuth();
    console.log(getUsersParamDto, limit, page, isAuth);
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  /**
   * Finds a single user by ID of the user
   */
  public async findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * Creates a new user in the database
   */
  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.find({
      where: { email: createUserDto.email },
    });
    console.log(existingUser);
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }
}
