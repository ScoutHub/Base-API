import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly saltOrRounds: number = 10;
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  findOneById(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        email,
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

  async new(user: User): Promise<User | string> {
    if (await this.findOneByEmail(user.email)) {
      return 'Email already exist';
    }
    if (await this.findOneByPseudo(user.pseudo)) {
      return 'Pseudo already exist';
    }
    if (user.password.length < 8) {
      return 'Password length must be > 8';
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
