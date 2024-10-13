import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PostagemService } from '../services/postagem.service';
import { Postagem } from '../models/postagem.model';


@Controller('postagens')
export class PostagemController {
  constructor(private readonly postagemService: PostagemService) {}

  @Get()
  findAll() {
    return this.postagemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postagemService.findById(id);
  }

  @Post()
  create(@Body() postagem: Postagem) {
    return this.postagemService.create(postagem);
  }

  @Put()
  update(@Body() postagem: Postagem) {
    return this.postagemService.update(postagem);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postagemService.delete(id);
  }
  
}