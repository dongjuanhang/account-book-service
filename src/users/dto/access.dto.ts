import { IsString } from 'class-validator';

export class AccessDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
