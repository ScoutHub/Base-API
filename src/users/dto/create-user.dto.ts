import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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
  @MinLength(8)
  @MaxLength(100)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsString()
  @IsEmail()
  @MinLength(10)
  @MaxLength(100)
  email: string;
}
