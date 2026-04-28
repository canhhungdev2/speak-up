import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get('course/:courseId')
  findAllByCourse(@Param('courseId') courseId: string) {
    return this.lessonsService.findAllByCourse(courseId);
  }

  @Get(':courseSlug/:lessonSlug')
  findOne(
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
  ) {
    return this.lessonsService.findOneBySlug(courseSlug, lessonSlug);
  }

  @Post()
  create(@Body() data: any) {
    return this.lessonsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.lessonsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }

  @Post('reorder')
  reorder(@Body() orderData: { id: string, order_index: number }[]) {
    return this.lessonsService.reorder(orderData);
  }
}
