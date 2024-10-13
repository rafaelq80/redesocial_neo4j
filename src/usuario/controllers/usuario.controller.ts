import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/usuario.service';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usuarioService.findById(id);
  }

  @Get('nome/:nome')
  findByName(@Param('nome') nome: string) {
    return this.usuarioService.findByNome(nome);
  }

  @Post()
  create(@Body() usuario: Usuario) {
    return this.usuarioService.create(usuario);
  }

  @Put()
  update(@Body() usuario: Usuario) {
    return this.usuarioService.update(usuario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.delete(id);
  }

  @Get(':usuarioId/amigos')
  getFriends(@Param('usuarioId') usuarioId: string) {
    return this.usuarioService.getFriends(usuarioId);
  }

  @Post(':usuarioId/amigos/:amigoId')
  addFriend(
    @Param('usuarioId') usuarioId: string,
    @Param('amigoId') amigoId: string,
  ) {
    return this.usuarioService.addFriend(usuarioId, amigoId);
  }

  @Delete(':usuarioId/amigos/:amigoId')
  removeFriend(
    @Param('usuarioId') usuarioId: string,
    @Param('amigoId') amigoId: string,
  ) {
    return this.usuarioService.removeFriend(usuarioId, amigoId);
  }
}
