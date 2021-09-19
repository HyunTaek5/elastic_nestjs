import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class File {
  filename: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;

  constructor(
    filename: string,
    encoding: string,
    mimetype: string,
    buffer: Buffer,
    size: number,
  ) {
    this.filename = filename;
    this.encoding = encoding;
    this.mimetype = mimetype;
    this.buffer = buffer;
    this.size = size;
  }
}

@Injectable()
export class AwsService {
  private readonly bucketName: string;
  private readonly s3: S3;
  private readonly resize_width: number;
  private readonly resize_quality: number;

  constructor(private configService: ConfigService) {
    this.bucketName = configService.get('AWS_BUCKET');
    this.s3 = new S3({
      region: configService.get('AWS_REGION'),
      accessKeyId: configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_KEY'),
    });
    this.resize_width = configService.get<number>('RESIZE_IMAGE_WIDTH', 768);
    this.resize_quality = configService.get<number>('RESIZE_IMAGE_QUALITY', 80);
  }

  private async upload(key: string, file: File, acl: string) {
    const fileType = file.mimetype;
    const fileBuffer = file.buffer;
    return this.s3
      .upload({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: fileType,
        ContentEncoding: file.encoding,
        ACL: acl,
      })
      .promise();
  }

  generateKey(path: string, filename: string) {
    return `${path}/${Date.now()}_${filename}`;
  }

  add(path: string, file: File) {
    const filename = file.filename;
    const key = this.generateKey(path, filename);
    return this.upload(key, file, 'private');
  }

  addToPublic(path: string, file: File) {
    const filename = file.filename;
    const key = this.generateKey(path, filename);
    return this.upload(key, file, 'public-read');
  }

  replace(key: string, file: File) {
    return this.upload(key, file, 'private');
  }

  replaceToPublic(key: string, file: File) {
    return this.upload(key, file, 'public-read');
  }

  getPreSignedUrl(key: string) {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucketName,
      Key: key,
    });
  }

  getUploadUrl(key: string) {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucketName,
      Key: key,
    });
  }
}
