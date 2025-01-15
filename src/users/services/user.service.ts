import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { UserValidationStatus } from '../../utils/enums/user-validation-status';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly saltOrRounds: number = 10;

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['password', 'refresh_token'] },
    });
  }

  findOneById(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
      attributes: { exclude: ['password', 'refresh_token'] },
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        email,
      },
    });
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        username,
      },
    });
  }

  async new(userData: CreateUserDto): Promise<User | UserValidationStatus> {
    if (await this.findOneByEmail(userData.email)) {
      return UserValidationStatus.EmailExist;
    }
    if (await this.findOneByUsername(userData.username)) {
      return UserValidationStatus.UsernameExist;
    }
    if (userData.password.length < 8) {
      return UserValidationStatus.WrongPasswordLength;
    }
    const hashedPass = await bcrypt.hash(userData.password, this.saltOrRounds);
    const userCreated = await this.userModel.create({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      password: hashedPass,
      username: userData.username,
    });
    return userCreated;
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.findOneById(id);

    if (user) {
      await user.destroy();
      return true;
    }
    return false;
  }

  async update(
    userData: UpdateUserDto,
    id: string,
  ): Promise<string | UserValidationStatus> {
    const userFoundWithEmail: User = await this.findOneByEmail(userData.email);
    const userFoundWithUsername: User = await this.findOneByUsername(
      userData.username,
    );
    if (
      userFoundWithEmail?.email === userData.email &&
      userFoundWithEmail?.id !== id
    ) {
      return UserValidationStatus.EmailExist;
    }
    if (
      userFoundWithUsername?.username === userData.username &&
      userFoundWithUsername?.id !== id
    ) {
      return UserValidationStatus.UsernameExist;
    }
    this.userModel.update(
      {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        username: userData.username,
      },
      {
        where: {
          id,
        },
      },
    );
    return 'User updated';
  }
}
