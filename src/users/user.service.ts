import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { RegisterState } from '../authentification/enums/register-state.enum';

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

  findOneByToken(refresh_token: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        refresh_token,
      },
    });
  }

  findOneByPseudo(pseudo: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        pseudo,
      },
    });
  }

  async new(user: User): Promise<User | RegisterState> {
    if (await this.findOneByEmail(user.email)) {
      return RegisterState.EmailExist;
    }
    if (await this.findOneByPseudo(user.pseudo)) {
      return RegisterState.PseudoExist;
    }
    if (user.password.length < 8) {
      return RegisterState.WrongPasswordLength;
    }
    const hashedPass = await bcrypt.hash(user.password, this.saltOrRounds);
    const userCreated = await this.userModel.create({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: hashedPass,
      pseudo: user.pseudo,
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
