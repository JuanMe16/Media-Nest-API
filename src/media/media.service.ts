import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { Repository } from 'typeorm';
import { MediaFileDto } from './dto';
import { unlink } from 'fs/promises';

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media) private mediaRepository: Repository<Media>
    ) { }

    async listUserMedia(
        userId: number
    ) {
        return await this.mediaRepository.find({
            where: {
                user: {
                    id: userId
                }
            }
        });
    }

    async findMediaFile(
        id: number,
        userId: number
    ) {
        return await this.mediaRepository.findOne({
            where: {
                user: {
                    id: userId
                },
                id: id
            }
        });
    }

    async createMediaFile(
        userId: number,
        payload: MediaFileDto
    ) {
        const newFile = this.mediaRepository.create({ user: { id: userId }, ...payload });
        await this.mediaRepository.save(newFile);
        return { filename: newFile.filename, type: newFile.type };
    };

    async updateMediaFile(
        mediaRecord: Media,
        newRecord: { path: string, filename: string }
    ) {
        await unlink(mediaRecord.path);
        mediaRecord.path = newRecord.path;
        mediaRecord.filename = newRecord.filename;
        return await this.mediaRepository.save(mediaRecord);
    }

    async deleteMediaFile(
        mediaRecord: Media
    ) {
        await unlink(mediaRecord.path);
        this.mediaRepository.delete({ id: mediaRecord.id });
        return { msg: 'Successfully deleted.' };
    }
}
