import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import type { Response } from 'express';

@Injectable()
export class MediaService {
  private readonly storagePath: string;

  constructor(private configService: ConfigService) {
    this.storagePath = this.configService.get<string>('STORAGE_PATH') || 'E:\\Workspace\\MyProject\\Storage\\speak-up-storage';
  }

  async saveCourseThumbnail(courseSlug: string, file: Express.Multer.File): Promise<string> {
    const relativePath = join('courses', courseSlug, `thumbnail-${Date.now()}${this.getExtension(file.originalname)}`);
    const fullPath = join(this.storagePath, relativePath);
    
    // Ensure directory exists
    const dir = dirname(fullPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Save file
    writeFileSync(fullPath, file.buffer);

    // Return only the relative path to be stored in DB
    const filename = relativePath.split(/[\\/]/).pop();
    return `/media/courses/${courseSlug}/thumbnail/${filename}`;
  }

  private getExtension(filename: string): string {
    const ext = filename.split('.').pop();
    return ext ? `.${ext}` : '';
  }

  /**
   * Serve a file from the external storage path
   * @param pathParts - Parts of the path within STORAGE_PATH (e.g. ['courses', 'slug', 'lessons', 'slug', 'audio.mp3'])
   */
  serveFileFromPath(pathParts: string[], res: Response) {
    const filePath = join(this.storagePath, ...pathParts);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File ${pathParts.join('/')} not found`);
    }

    const filename = pathParts[pathParts.length - 1];
    const mimeType = this.getMimeTypeByExtension(filename);
    
    return res.sendFile(filePath, {
      headers: {
        'Content-Type': mimeType,
      }
    });
  }

  getMimeTypeByExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'vtt': return 'text/vtt';
      case 'mp3': return 'audio/mpeg';
      case 'wav': return 'audio/wav';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'webp': return 'image/webp';
      case 'gif': return 'image/gif';
      case 'svg': return 'image/svg+xml';
      default: return 'application/octet-stream';
    }
  }
}
