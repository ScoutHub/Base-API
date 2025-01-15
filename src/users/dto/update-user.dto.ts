import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  first_name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  last_name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(100)
  username: string;

  @IsString()
  @IsEmail()
  @MinLength(10)
  @MaxLength(100)
  email: string;
}
