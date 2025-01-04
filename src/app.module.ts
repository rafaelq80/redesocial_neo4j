import { Module } from '@nestjs/common';
import { Neo4jModule } from 'nest-neo4j/dist';
import { PostagemModule } from './postagem/postagem.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: 'bolt',
      host: '127.0.0.1', 
      port: 7687,
      username: 'neo4j',
      password: 'rootroot',
      database: 'neo4j', 
      config: {
        encrypted: false,
        maxConnectionPoolSize: 50,
        connectionTimeout: 30000, 
      },
    }),
    UsuarioModule,
    PostagemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}