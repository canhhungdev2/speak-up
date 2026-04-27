import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';

@Injectable()
export class MediaService {
  private readonly storagePath: string;

  constructor(private configService: ConfigService) {
    this.storagePath = this.configService.get<string>('STORAGE_PATH') || 'E:\\Workspace\\MyProject\\Storage\\speak-up-storage';
  }

  serveFile(type: 'audio' | 'vtt', filename: string, res: Response) {
    const filePath = join(this.storagePath, type, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} not found in ${type} storage`);
    }

    const mimeType = this.getMimeType(type, filename);
    
    // Sử dụng res.sendFile giúp Express tự động xử lý Content-Length, Accept-Ranges, và Caching
    return res.sendFile(filePath, {
      headers: {
        'Content-Type': mimeType,
      }
    });
  }

  getMimeType(type: 'audio' | 'vtt', filename: string): string {
    if (type === 'vtt') return 'text/vtt';
    if (filename.endsWith('.mp3')) return 'audio/mpeg';
    if (filename.endsWith('.wav')) return 'audio/wav';
    return 'application/octet-stream';
  }
}
