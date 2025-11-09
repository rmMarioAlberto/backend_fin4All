import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Cloudinary } from './cloudinary.provider';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  private v2: any;

  constructor(
    @Inject(Cloudinary)
    private cloudinary,
  ) {
    this.cloudinary.v2.config({
      secure: true,
    });
    this.v2 = cloudinary.v2;
  }

  async upload(file: any) {
    return await this.v2.uploader.upload(file);
  }

  async uploadBase64(base64: string, options: any = {}, fileName?: string) {
    try {
      // Detectar mime por extensión si se proporcionó fileName
      let mimeType = 'application/octet-stream';
      if (fileName) {
        const ext = path.extname(fileName).toLowerCase();
        if (ext === '.pdf') mimeType = 'application/pdf';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        else if (ext === '.png') mimeType = 'image/png';
      }

      // Si options ya trae resource_type no lo pisamos; si no, lo definimos según mime
      if (!options.resource_type) {
        if (mimeType === 'application/pdf') {
          options.resource_type = 'raw'; // importante para PDFs
        } else if (mimeType.startsWith('image/')) {
          options.resource_type = 'image';
        } else {
          options.resource_type = 'auto';
        }
      }

      // Formar dataUri completo (Cloudinary acepta data URI también para raw)
      const dataUri = `data:${mimeType};base64,${base64}`;
      const uploadResult = await this.v2.uploader.upload(dataUri, options);
      return uploadResult;
    } catch (error) {
      throw new BadRequestException({
        message: 'Error al subir archivo a Cloudinary',
        error: (error && error.message) || error,
      });
    }
  }
}
