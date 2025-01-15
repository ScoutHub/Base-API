import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { Response } from 'express';
import { AuthGuard } from '../authentification/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserValidationStatus } from 'src/utils/enums/user-validation-status';

@Controller('/api/users')
@UseGuards(AuthGuard)
export class UserController {
  private responseMessage: string | User;
  private statusToReturn: number;

  constructor(private userService: UserService) {}

  @Get('/list')
  @Header('Content-Type', 'application/json')
  async getAllUsers(@Res() response: Response): Promise<Response> {
    const users: Array<User> = await this.userService.findAll();
    this.statusToReturn = 200;
    return response.status(this.statusToReturn).send({
      users,
    });
  }

  @Get('/')
  @Header('Content-Type', 'application/json')
  async getUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    this.responseMessage = 'User not found';
    this.statusToReturn = 404;
    const user = await this.userService.findOneById(request['id']);
    if (user) {
      this.statusToReturn = 200;
      this.responseMessage = user;
    }
    return response.status(this.statusToReturn).send(this.responseMessage);
  }

  @Put('/')
  @Header('Content-Type', 'application/json')
  async updateUser(
    @Body() udpateUserDto: UpdateUserDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    this.statusToReturn = 404;
    const saved: string | UserValidationStatus = await this.userService.update(
      udpateUserDto,
      request['id'],
    );
    if (saved === 'User updated') {
      this.statusToReturn = 200;
    }
    return response.status(this.statusToReturn).send({ message: saved });
  }

  @Delete('/')
  @Header('Content-Type', 'application/json')
  async deleteUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    this.responseMessage = 'User not found';
    this.statusToReturn = 404;
    if (await this.userService.remove(request['id'])) {
      this.statusToReturn = 200;
      this.responseMessage = 'User successfully deleted';
    }
    return response
      .status(this.statusToReturn)
      .send({ message: this.responseMessage });
  }
}
