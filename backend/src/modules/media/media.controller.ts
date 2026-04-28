import { Controller, Get, Post, Param, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { MediaService } from './media.service';
import type { Response } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('courses/:courseSlug/thumbnail/:filename')
  serveCourseThumbnail(
    @Param('courseSlug') courseSlug: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return this.mediaService.serveFileFromPath(['courses', courseSlug, filename], res);
  }

  @Post('upload/course-thumbnail/:courseSlug')
  @UseInterceptors(FileInterceptor('file'))
  uploadCourseThumbnail(
    @Param('courseSlug') courseSlug: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.saveCourseThumbnail(courseSlug, file);
  }
  
  @Post('upload/lesson-media/:courseSlug/:lessonSlug')
  @UseInterceptors(FileInterceptor('file'))
  uploadLessonMedia(
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.mediaService.saveLessonMedia(courseSlug, lessonSlug, file);
  }

  @Get('courses/:courseSlug/lessons/:lessonSlug/:filename')
  serveLessonMedia(
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return this.mediaService.serveFileFromPath(['courses', courseSlug, 'lessons', lessonSlug, filename], res);
  }

  @Get(':type/:filename')
  getFile(
    @Param('type') type: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    // This maintains legacy support for /media/audio/filename.mp3 etc.
    return this.mediaService.serveFileFromPath([type, filename], res);
  }
}
