import { IsNotEmpty, IsString } from "class-validator";

export class MediaFileDto {
    constructor(filename: string, path: string, type: string) {
        this.filename = filename;
        this.path = path;
        this.type = type;
    }

    @IsString()
    @IsNotEmpty()
    filename: string;

    @IsString()
    @IsNotEmpty()
    path: string;

    @IsString()
    @IsNotEmpty()
    type: string;
}