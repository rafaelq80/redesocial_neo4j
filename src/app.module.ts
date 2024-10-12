import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from 'nest-neo4j/dist';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [
    Neo4jModule.forRoot({
      scheme: 'bolt',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'rootroot',
      config: {
        encrypted: false,
        trust: 'TRUST_ALL_CERTIFICATES',
      },
    }),
    UsuarioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
