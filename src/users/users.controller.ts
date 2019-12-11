import { Controller, Post, Request, UseGuards, Options } from '@nestjs/common';
import { AUTH_TYPE, USERS_PATH } from '../consts';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller(USERS_PATH.ROOT)
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard(AUTH_TYPE.LOCAL))
  @Post(USERS_PATH.ACCESS)
  systemAccess(@Request() req) {
    return this.authService.login(req.user);
  }
}
