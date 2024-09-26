import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { RegisterState } from '../authentification/enums/register-state.enum';
import { CreateUserDto } from './dto/create-user.dto';

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

  async new(userData: CreateUserDto): Promise<User | RegisterState> {
    if (await this.findOneByEmail(userData.email)) {
      return RegisterState.EmailExist;
    }
    if (await this.findOneByUsername(userData.username)) {
      return RegisterState.UsernameExist;
    }
    if (userData.password.length < 8) {
      return RegisterState.WrongPasswordLength;
    }
    const hashedPass = await bcrypt.hash(userData.password, this.saltOrRounds);
    const userCreated = await this.userModel.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
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
}
