import { Controller, Get, Param, Res } from '@nestjs/common';
import { MediaService } from './media.service';
import type { Response } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':type/:filename')
  getFile(
    @Param('type') type: 'audio' | 'vtt',
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return this.mediaService.serveFile(type, filename, res);
  }
}
