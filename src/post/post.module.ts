import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';

import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports : [PrismaModule,JwtModule]

})
export class PostModule {}
