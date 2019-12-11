import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { get } from 'lodash';
import sha256 = require('crypto-js/sha256');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findOne(username);
      const passEncoded = this.encodePassword(pass, get(user, 'salt'));
      if (get(user, 'password') === passEncoded) {
        const { password, salt, ...result } = user;
        return {
          ...result,
          isNew: false,
        };
      }
      return null;
    } catch (e) {
      const newSalt = this.getSalt();
      const passToSave = this.encodePassword(pass, newSalt);
      const user = await this.usersService.createOne(username, passToSave, newSalt);
      const { password, salt, ...result } = user;
      return {
        ...result,
        isNew: true,
      };
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      accessToken: `Bearer ${this.jwtService.sign(payload)}`,
      isNew: user.isNew,
    };
  }

  getSalt() {
    return 'account-book' + Date.now();
  }

  encodePassword(pass, salt) {
    return sha256(pass + salt).toString();
  }
}
