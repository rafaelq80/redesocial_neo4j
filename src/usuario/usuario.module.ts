import { Module } from '@nestjs/common';
import { UsuarioController } from './controller/usuario.controller';
import { UsuarioService } from './service/usuario.service';

@Module({
  providers: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}