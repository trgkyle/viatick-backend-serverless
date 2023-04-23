import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post('sign-in')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.userService.signIn(signInDto.username, signInDto.password);
  }

  @Post('sign-up')
  signUp(@Body() signUpDto: Record<string, any>) {
    return this.userService.signUp(signUpDto.username, signUpDto.password);
  }
}
