// import { Injectable, Inject } from '@nestjs/common';
// import { Cloudinary } from './cloudinary.provider';
// import * as path from 'path'; 

// @Injectable()
// export class CloudinaryService {
//   private v2: any;

//   constructor(
//     @Inject(Cloudinary)
//     private cloudinary,
//   ) {
//     this.cloudinary.v2.config({
//       secure: true,
//     });
//     this.v2 = cloudinary.v2;
//   }

//   async upload(file: any) {
//     return await this.v2.uploader.upload(file);
//   }

//   async uploadBase64(base64: string, options: any, fileName?: string) {
//     let mimeType = 'application/octet-stream';

//     if (fileName) {
//       const ext = path.extname(fileName).toLowerCase();
//       if (ext === '.pdf') {
//         mimeType = 'application/pdf';
//       } else if (ext === '.jpg' || ext === '.jpeg') {
//         mimeType = 'image/jpeg';
//       } else if (ext === '.png') {
//         mimeType = 'image/png';
//       } 
//     }

//     const dataUri = `data:${mimeType};base64,${base64}`;
//     return await this.v2.uploader.upload(dataUri, options);
//   }
// }