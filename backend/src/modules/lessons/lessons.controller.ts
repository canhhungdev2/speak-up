import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('lessons')
@UseGuards(SupabaseAuthGuard, RolesGuard)
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
  @Roles('admin')
  create(@Body() data: any) {
    return this.lessonsService.create(data);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: any) {
    return this.lessonsService.update(id, data);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }

  @Post('reorder')
  @Roles('admin')
  reorder(@Body() orderData: { id: string, order_index: number }[]) {
    return this.lessonsService.reorder(orderData);
  }
}
