import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class UsuarioService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createUser(username: string): Promise<any> {
    const result = await this.neo4jService.write(
      `CREATE (u:User {username: $username}) RETURN u`,
      { username }
    );
    return result.records[0].get('u').properties;
  }

  async followUser(followerUsername: string, followedUsername: string): Promise<void> {
    await this.neo4jService.write(
      `
      MATCH (follower:User {username: $followerUsername})
      MATCH (followed:User {username: $followedUsername})
      MERGE (follower)-[:FOLLOWS]->(followed)
      `,
      { followerUsername, followedUsername }
    );
  }

  async getFollowers(username: string): Promise<string[]> {
    const result = await this.neo4jService.read(
      `
      MATCH (follower:User)-[:FOLLOWS]->(u:User {username: $username})
      RETURN follower.username AS follower
      `,
      { username }
    );
    return result.records.map(record => record.get('follower'));
  }

  async getFollowing(username: string): Promise<string[]> {
    const result = await this.neo4jService.read(
      `
      MATCH (u:User {username: $username})-[:FOLLOWS]->(followed:User)
      RETURN followed.username AS followed
      `,
      { username }
    );
    return result.records.map(record => record.get('followed'));
  }
}