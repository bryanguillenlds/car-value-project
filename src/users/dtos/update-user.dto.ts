import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  //IsOptional decorator is necessary so that this dto
  //can be use for partial updates via PATCH request.
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
