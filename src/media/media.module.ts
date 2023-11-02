import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({ dest: './media' }),
    TypeOrmModule.forFeature([Media])
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule { }
