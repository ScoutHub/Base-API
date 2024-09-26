import { UUID } from 'sequelize';
import { UUIDV4 } from 'sequelize';
import {
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @Unique
  @PrimaryKey
  @Default(UUIDV4)
  @Column({
    type: UUID,
  })
  id: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  username: string;

  @Column
  password: string;
}
