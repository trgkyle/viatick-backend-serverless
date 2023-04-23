import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import * as bcrypt from 'bcryptjs';

import { User, UserId } from './user/entities/user.interface';

@Injectable()
export class UserService {
  saltOrRounds = 10;
  constructor(
    @InjectModel('viatick-react-native-backend')
    private userModel: Model<User, UserId>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userModel.get({ username });
    if (!user) {
      throw new UnauthorizedException();
    } else {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) {
        throw new UnauthorizedException();
      }
      const { password, ...result } = user;
      return result;
    }
  }

  async signUp(username: string, password: string): Promise<any> {
    const user = await this.userModel.get({ username });
    if (user) {
      throw new ForbiddenException();
    } else {
      const hash = await bcrypt.hash(password, this.saltOrRounds);
      return await this.userModel.create({ username, password: hash });
    }
  }
}
