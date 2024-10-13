import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { Usuario } from '../models/usuario.model';


@Injectable()
export class UsuarioService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async findAll(): Promise<Usuario[]> {
    const result = await this.neo4jService.read(`MATCH (u:Usuario) RETURN u`);
    return result.records.map(record => record.get('u').properties as Usuario);
  }

  async findById(id: string): Promise<Usuario> {
    const result = await this.neo4jService.read(`
      MATCH (u:Usuario {id: $id})
      RETURN u
    `, { id });
    return result.records[0]?.get('u').properties as Usuario;
  }

  async findByNome(nome: string): Promise<Usuario[]> {
    const result = await this.neo4jService.read(`
      MATCH (u:Usuario)
      WHERE u.nome =~ $nome
      RETURN u
    `, { nome: `(?i).*${nome}.*` });

    return result.records.map(record => record.get('u').properties as Usuario);
  }

  async create(usuario: Usuario): Promise<Usuario> {
    const result = await this.neo4jService.write(`
      CREATE (u:Usuario {
        id: randomUUID(),
        nome: $nome,
        usuario: $usuario,
        senha: $senha
      })
      RETURN u
    `, { nome: usuario.nome, usuario: usuario.usuario, senha: usuario.senha });
    return result.records[0].get('u').properties as Usuario;
  }

  async update(usuario: Usuario): Promise<Usuario> {
    const { id, ...updateData } = usuario;
    
    // Construir a string de atualização dinamicamente
    const updateString = Object.entries(updateData)
      .map(([key, value]) => `u.${key} = $${key}`)
      .join(', ');

    const result = await this.neo4jService.write(`
      MATCH (u:Usuario {id: $id})
      SET ${updateString}, u.caption = $usuario
      RETURN u
    `, { id, ...updateData });

    return result.records[0].get('u').properties as Usuario;
  }

  async delete(id: string): Promise<void> {
    await this.neo4jService.write(`
      MATCH (u:Usuario {id: $id})
      DETACH DELETE u
    `, { id });
  }

  async getFriends(usuarioId: string): Promise<Usuario[]> {
    const result = await this.neo4jService.read(`
      MATCH (u:Usuario {id: $usuarioId})-[:AMIGO_DE]->(amigo:Usuario)
      RETURN amigo
    `, { usuarioId });
    return result.records.map(record => record.get('amigo').properties as Usuario);
  }
  
  async addFriend(usuarioId: string, amigoId: string): Promise<void> {
    await this.neo4jService.write(`
      MATCH (u1:Usuario {id: $usuarioId})
      MATCH (u2:Usuario {id: $amigoId})
      MERGE (u1)-[:AMIGO_DE]->(u2)
    `, { usuarioId, amigoId });
  }

  async removeFriend(usuarioId: string, amigoId: string): Promise<void> {
    await this.neo4jService.write(`
      MATCH (u1:Usuario {id: $usuarioId})-[r:AMIGO_DE]-(u2:Usuario {id: $amigoId})
      DELETE r
    `, { usuarioId, amigoId });
  }

}