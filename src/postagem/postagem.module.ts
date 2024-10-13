import { Module } from '@nestjs/common';
import { PostagemController } from './controllers/postagem.controller';
import { PostagemService } from './services/postagem.service';

@Module({
  providers: [PostagemService],
  controllers: [PostagemController],
  exports: [PostagemService],
})
export class PostagemModule {}