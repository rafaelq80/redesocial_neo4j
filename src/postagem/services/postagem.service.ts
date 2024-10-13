import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { Postagem } from '../models/postagem.model';


@Injectable()
export class PostagemService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findAll(): Promise<Postagem[]> {
    const result = await this.neo4jService.read(`MATCH (p:Postagem)<-[:POSTADO_POR]-(u:Usuario) RETURN p, u.id as usuarioId`);
    return result.records.map(record => ({
      ...record.get('p').properties,
      usuarioId: record.get('usuarioId')
    } as Postagem));
  }

  async findById(id: string): Promise<Postagem> {
    const result = await this.neo4jService.read(`
      MATCH (p:Postagem {id: $id})<-[:POSTADO_POR]-(u:Usuario)
      RETURN p, u.id as usuarioId
    `, { id });
    const record = result.records[0];
    return record ? {
      ...record.get('p').properties,
      usuarioId: record.get('usuarioId')
    } as Postagem : null;
  }

  async create(postagem: Postagem): Promise<Postagem> {
    const result = await this.neo4jService.write(`
      MATCH (u:Usuario {id: $usuarioId})
      CREATE (p:Postagem {
        id: randomUUID(),
        conteudo: $conteudo,
        updatedAt: datetime()
      })<-[:POSTADO_POR]-(u)
      RETURN p
    `, { usuarioId: postagem.usuarioId, conteudo: postagem.conteudo });
    return result.records[0].get('p').properties as Postagem;
  }

  async update(postagem: Postagem): Promise<Postagem> {
    const { id, ...updateData } = postagem;
    
    // Construir a string de atualização dinamicamente
    const updateString = Object.entries(updateData)
      .map(([key, value]) => `p.${key} = $${key}`)
      .join(', ');

    const result = await this.neo4jService.write(`
      MATCH (p:Postagem {id: $id})
      SET ${updateString}, p.caption = left($conteudo, 20) + '...', p.updatedAt = datetime()
      RETURN p
    `, { id, ...updateData });

    return result.records[0].get('p').properties as Postagem;
  }

  async delete(id: string): Promise<void> {
    await this.neo4jService.write(`
      MATCH (p:Postagem {id: $id})
      DETACH DELETE p
    `, { id });
  }

}