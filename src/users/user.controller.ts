import {
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { Response } from 'express';
import { AuthGuard } from '../authentification/auth.guard';

@Controller('/api/users')
@UseGuards(AuthGuard)
export class UserController {
  private responseMessage: string | User;
  private statusToReturn: number;

  constructor(private userService: UserService) {}

  @Get('/')
  @Header('Content-Type', 'application/json')
  async getAllUsers(@Res() response: Response): Promise<Response> {
    const users: Array<User> = await this.userService.findAll();
    this.statusToReturn = 200;
    return response.status(this.statusToReturn).send({
      users,
    });
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  async getUser(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    this.responseMessage = 'User not found';
    this.statusToReturn = 404;
    const user = await this.userService.findOneById(id);
    if (user) {
      this.statusToReturn = 200;
      this.responseMessage = user;
    }
    return response.status(this.statusToReturn).send(this.responseMessage);
  }

  @Delete(':id')
  @Header('Content-Type', 'application/json')
  async deleteUser(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    this.responseMessage = 'User not found';
    this.statusToReturn = 404;
    if (await this.userService.remove(id)) {
      this.statusToReturn = 200;
      this.responseMessage = 'User successfully deleted';
    }
    return response
      .status(this.statusToReturn)
      .send({ message: this.responseMessage });
  }
}
