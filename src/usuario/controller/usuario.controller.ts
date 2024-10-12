import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { UsuarioService } from '../service/usuario.service';


@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly userService: UsuarioService) {}

  @Post()
  async createUser(@Body('username') username: string) {
    return this.userService.createUser(username);
  }

  @Post(':followerUsername/follow/:followedUsername')
  async followUser(
    @Param('followerUsername') followerUsername: string,
    @Param('followedUsername') followedUsername: string,
  ) {
    await this.userService.followUser(followerUsername, followedUsername);
    return { message: 'User followed successfully' };
  }

  @Get(':username/followers')
  async getFollowers(@Param('username') username: string) {
    return this.userService.getFollowers(username);
  }

  @Get(':username/following')
  async getFollowing(@Param('username') username: string) {
    return this.userService.getFollowing(username);
  }
}
