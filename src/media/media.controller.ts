import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    ParseIntPipe,
    UseGuards,
    Delete,
    UseInterceptors,
    UploadedFile,
    Req,
    HttpException,
    StreamableFile
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { MediaFileDto } from './dto';
import { createReadStream } from 'fs';
import { join } from 'path';

@UseGuards(AuthGuard)
@Controller('media')
export class MediaController {
    constructor(private mediaService: MediaService) { }

    @Get()
    async listMediaFiles(
        @Req() request: Request
    ) {
        const userId = request['user']['id'];
        return await this.mediaService.listUserMedia(userId);
    }

    @Get(':id')
    async downloadMediaFile(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request
    ) {
        const userId = request['user']['id'];
        const mediaFile = await this.mediaService.findMediaFile(id, userId);
        if (!mediaFile) throw new HttpException({ error: 'This field was not found.' }, 404);
        const file = createReadStream(join(process.cwd(), mediaFile.path));
        return new StreamableFile(file);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadMediaFile(
        @UploadedFile() file: Express.Multer.File,
        @Req() request: Request
    ) {
        const mediaPayload = new MediaFileDto(file.filename, file.path, file.mimetype);
        const userId = request['user']['id'];
        return await this.mediaService.createMediaFile(userId, mediaPayload);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async replaceMediaFile(
        @UploadedFile() file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request
    ) {
        const userId = request['user']['id'];
        const mediaFile = await this.mediaService.findMediaFile(id, userId);
        if (!mediaFile) throw new HttpException({ error: 'This field was not found.' }, 404);
        return await this.mediaService.updateMediaFile(mediaFile, { path: file.path, filename: file.filename });
    }

    @Delete(':id')
    async deleteMediaFile(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request
    ) {
        const userId = request['user']['id'];
        const mediaFile = await this.mediaService.findMediaFile(id, userId);
        if (!mediaFile) throw new HttpException({ error: 'This field was not found.' }, 404);
        return await this.mediaService.deleteMediaFile(mediaFile);
    }
}
